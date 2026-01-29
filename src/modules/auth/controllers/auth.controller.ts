import {
  Controller,
  Post,
  Get,
  Body,
  Request,
  HttpCode,
  HttpStatus,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
} from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { AuthRepository } from '../repositories/auth.repository';
import { RegisterDto, LoginDto, AuthResponseDto } from '../dto';
import { JwtGuard } from '../guards/jwt.guard';
import { CurrentUser } from '../interfaces/jwt-payload.interface';

interface AuthenticatedRequest extends Request {
  user: CurrentUser;
}

/**
 * Authentication Controller
 * Handles user registration, login, logout, token refresh, and profile management
 */
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authRepository: AuthRepository,
  ) {}

  /**
   * Register a new user account
   * Creates a new user with email and password, returns authentication tokens
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register a new user',
    description:
      'Create a new user account with email and password. Returns access and refresh tokens upon successful registration. User can optionally provide first name, last name, and phone number.',
  })
  @ApiBody({
    type: RegisterDto,
    description: 'User registration details with email and password',
  })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: AuthResponseDto,
    example: {
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
    },
  })
  @ApiResponse({
    status: 409,
    description: 'User with this email already exists',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 409 },
        message: {
          type: 'string',
          example: 'User with this email already exists',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data or validation error',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'array',
          example: ['email must be an email', 'password is too short'],
        },
      },
    },
  })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  /**
   * Login with email and password
   * Authenticates user and returns access and refresh tokens
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login user',
    description:
      'Authenticate user with email and password. Returns access token (short-lived) and refresh token (long-lived) upon successful authentication.',
  })
  @ApiBody({
    type: LoginDto,
    description: 'User login credentials (email and password)',
  })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
    type: AuthResponseDto,
    example: {
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid email or password',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Invalid email or password' },
      },
    },
  })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  /**
   * Refresh access token
   * Generates a new access token using a valid refresh token
   */
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Refresh access token',
    description:
      'Generate a new access token using the refresh token stored in the Authorization header. The refresh token must be valid and not expired. Returns a new short-lived access token.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token (refresh token)',
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'New access token generated successfully',
    schema: {
      properties: {
        accessToken: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          description: 'New access token valid for 15 minutes',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Authorization header is missing or invalid format',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'string',
          example: 'Authorization header is required',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired refresh token',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: {
          type: 'string',
          example: 'Invalid refresh token or token expired',
        },
      },
    },
  })
  async refreshToken(
    @Request() req: AuthenticatedRequest,
  ): Promise<{ accessToken: string }> {
    const authHeader = req.headers.get('authorization');

    if (!authHeader) {
      throw new BadRequestException('Authorization header is required');
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new BadRequestException('Invalid authorization header format');
    }

    const refreshToken = parts[1];
    if (!refreshToken) {
      throw new BadRequestException('Refresh token is required');
    }

    return this.authService.refreshToken(req.user.userId, refreshToken);
  }

  /**
   * Logout user
   * Invalidates all refresh tokens for the user
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Logout user',
    description:
      'Logout the authenticated user by invalidating all refresh tokens. After logout, the user will need to login again to access protected resources.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token (access token)',
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'User logged out successfully',
    schema: {
      properties: {
        message: {
          type: 'string',
          example: 'Logged out successfully',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing token',
  })
  async logout(
    @Request() req: AuthenticatedRequest,
  ): Promise<{ message: string }> {
    await this.authService.logout(req.user.userId);
    return { message: 'Logged out successfully' };
  }

  /**
   * Get current user profile
   * Returns the authenticated user's profile information
   */
  @Get('me')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get current user profile',
    description:
      'Retrieve the current authenticated user profile information including email, name, and phone number. Requires valid JWT access token.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token (access token)',
    example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    schema: {
      properties: {
        userId: {
          type: 'string',
          example: 'clh7k9x0v0001qz0c8b3c4d5e',
          description: 'Unique user identifier',
        },
        email: {
          type: 'string',
          example: 'john.doe@example.com',
          description: 'User email address',
        },
        firstName: {
          type: 'string',
          example: 'John',
          nullable: true,
          description: 'User first name',
        },
        lastName: {
          type: 'string',
          example: 'Doe',
          nullable: true,
          description: 'User last name',
        },
        phone: {
          type: 'string',
          example: '+1234567890',
          nullable: true,
          description: 'User phone number',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing token',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async getCurrentUser(
    @Request() req: AuthenticatedRequest,
  ): Promise<Record<string, string | null>> {
    const user = await this.authRepository.findUserById(req.user.userId);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return {
      userId: user.id,
      email: user.email,
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      phone: user.phone || null,
    };
  }
}
