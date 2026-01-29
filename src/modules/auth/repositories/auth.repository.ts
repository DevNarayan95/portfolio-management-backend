import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { RegisterDto } from '../dto/register.dto';
import { User, RefreshToken } from '@prisma/client';

@Injectable()
export class AuthRepository {
  private readonly logger = new Logger(AuthRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Find user by email
   * @param email User email address
   * @returns User object or null if not found
   */
  async findUserByEmail(email: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { email },
      });
    } catch (error) {
      this.logger.error(`Error finding user by email: ${email}`, error);
      throw error;
    }
  }

  /**
   * Find user by ID
   * @param id User ID
   * @returns User object or null if not found
   */
  async findUserById(id: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { id },
      });
    } catch (error) {
      this.logger.error(`Error finding user by ID: ${id}`, error);
      throw error;
    }
  }

  /**
   * Create new user
   * @param registerDto Registration data with hashed password
   * @returns Newly created user
   */
  async createUser(
    registerDto: RegisterDto & { password: string },
  ): Promise<User> {
    try {
      const { email, password, firstName, lastName, phone } = registerDto;
      return await this.prisma.user.create({
        data: {
          email,
          password,
          firstName: firstName || null,
          lastName: lastName || null,
          phone: phone || null,
        },
      });
    } catch (error) {
      this.logger.error(`Error creating user: ${registerDto.email}`, error);
      throw error;
    }
  }

  /**
   * Create refresh token
   * @param userId User ID
   * @param token Refresh token
   * @param expiresAt Token expiration date
   * @returns Created refresh token
   */
  async createRefreshToken(
    userId: string,
    token: string,
    expiresAt: Date,
  ): Promise<RefreshToken> {
    try {
      return await this.prisma.refreshToken.create({
        data: {
          userId,
          token,
          expiresAt,
        },
      });
    } catch (error) {
      this.logger.error(
        `Error creating refresh token for user: ${userId}`,
        error,
      );
      throw error;
    }
  }

  /**
   * Find refresh token
   * @param token Refresh token string
   * @returns Refresh token object or null if not found
   */
  async findRefreshToken(token: string): Promise<RefreshToken | null> {
    try {
      return await this.prisma.refreshToken.findUnique({
        where: { token },
      });
    } catch (error) {
      this.logger.error('Error finding refresh token', error);
      throw error;
    }
  }

  /**
   * Delete all refresh tokens for a user
   * @param userId User ID
   * @returns Number of deleted tokens
   */
  async deleteRefreshTokensByUser(userId: string): Promise<number> {
    try {
      const result = await this.prisma.refreshToken.deleteMany({
        where: { userId },
      });
      return result.count;
    } catch (error) {
      this.logger.error(
        `Error deleting refresh tokens for user: ${userId}`,
        error,
      );
      throw error;
    }
  }

  /**
   * Delete specific refresh token
   * @param token Refresh token string
   * @returns Deleted refresh token
   */
  async deleteRefreshToken(token: string): Promise<RefreshToken> {
    try {
      return await this.prisma.refreshToken.delete({
        where: { token },
      });
    } catch (error) {
      this.logger.error('Error deleting refresh token', error);
      throw error;
    }
  }
}
