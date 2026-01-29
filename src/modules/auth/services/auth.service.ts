import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { AuthRepository } from '../repositories/auth.repository';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { TokenResponse } from '../interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly saltRounds = 10;

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Register a new user
   * @param registerDto User registration data
   * @returns Authentication response with tokens
   * @throws ConflictException if user already exists
   */
  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, password } = registerDto;

    // Check if user already exists
    const existingUser = await this.authRepository.findUserByEmail(email);
    if (existingUser) {
      this.logger.warn(`Registration failed: User ${email} already exists`);
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, this.saltRounds);

    // Create user
    const user = await this.authRepository.createUser({
      ...registerDto,
      password: hashedPassword,
    });

    // Generate tokens
    const tokens = this.generateTokens(user.id, user.email);

    this.logger.log(`User ${email} registered successfully`);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }

  /**
   * Login user with email and password
   * @param loginDto Login credentials
   * @returns Authentication response with tokens
   * @throws UnauthorizedException if credentials are invalid
   */
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    // Find user
    const user = await this.authRepository.findUserByEmail(email);
    if (!user) {
      this.logger.warn(`Login failed: User ${email} not found`);
      throw new UnauthorizedException('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      this.logger.warn(`Login failed: Invalid password for ${email}`);
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate tokens
    const tokens = this.generateTokens(user.id, user.email);

    // Store refresh token in database (7 days expiration)
    const refreshTokenExpiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000,
    );
    await this.authRepository.createRefreshToken(
      user.id,
      tokens.refreshToken,
      refreshTokenExpiresAt,
    );

    this.logger.log(`User ${email} logged in successfully`);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }

  /**
   * Logout user by deleting all refresh tokens
   * @param userId User ID
   */
  async logout(userId: string): Promise<void> {
    const deletedCount =
      await this.authRepository.deleteRefreshTokensByUser(userId);
    this.logger.log(
      `User ${userId} logged out (${deletedCount} tokens deleted)`,
    );
  }

  /**
   * Generate JWT access and refresh tokens
   * @param userId User ID
   * @param email User email
   * @returns Access and refresh tokens
   */
  private generateTokens(userId: string, email: string): TokenResponse {
    const jwtRefreshSecret =
      this.configService.get<string>('JWT_REFRESH_SECRET');

    if (!jwtRefreshSecret) {
      throw new Error('JWT_REFRESH_SECRET not configured in environment');
    }

    // Access token - uses module's configured secret
    const accessToken = this.jwtService.sign(
      { sub: userId, email },
      {
        expiresIn: 3600, // 1 hour in seconds
      },
    );

    // Refresh token - uses separate secret
    const refreshToken = this.jwtService.sign(
      { sub: userId, email },
      {
        secret: jwtRefreshSecret,
        expiresIn: 604800, // 7 days in seconds
      },
    );

    return { accessToken, refreshToken };
  }

  /**
   * Refresh access token using refresh token
   * @param userId User ID from JWT payload
   * @param refreshToken Refresh token from request header
   * @returns New access token
   * @throws BadRequestException if refresh token is missing
   * @throws UnauthorizedException if token is invalid or expired
   */
  async refreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<{ accessToken: string }> {
    if (!refreshToken) {
      throw new BadRequestException('Refresh token is required');
    }

    // Find stored token
    const storedToken =
      await this.authRepository.findRefreshToken(refreshToken);

    if (!storedToken || storedToken.userId !== userId) {
      this.logger.warn(`Invalid refresh token for user ${userId}`);
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Check expiration
    if (new Date() > storedToken.expiresAt) {
      this.logger.warn(`Refresh token expired for user ${userId}`);
      throw new UnauthorizedException('Refresh token has expired');
    }

    // Find user
    const user = await this.authRepository.findUserById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Generate new access token (uses module's configured secret)
    const accessToken = this.jwtService.sign(
      { sub: user.id, email: user.email },
      {
        expiresIn: 3600, // 1 hour in seconds
      },
    );

    this.logger.log(`Access token refreshed for user ${userId}`);

    return { accessToken };
  }
}
