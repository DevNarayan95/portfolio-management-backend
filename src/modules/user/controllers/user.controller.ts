import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { UserProfileDto, UpdateProfileDto, ChangePasswordDto } from '../dtos';
import { IUserStats } from '../interfaces/user.interface';
import { JwtGuard } from '../../auth/guards/jwt.guard';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
  };
}

/**
 * User Controller
 * Handles user profile, settings, and account management
 */
@ApiTags('User')
@Controller('users')
@UseGuards(JwtGuard)
@ApiBearerAuth('JWT-auth')
export class UserController {
  constructor(private userService: UserService) {}

  /**
   * Get current user profile
   */
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get current user profile',
    description: 'Retrieve the authenticated user profile information.',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    type: UserProfileDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async getProfile(
    @Request() req: AuthenticatedRequest,
  ): Promise<UserProfileDto> {
    return this.userService.getUserProfile(req.user.userId);
  }

  /**
   * Update user profile
   */
  @Put('profile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update user profile',
    description:
      'Update user profile information such as name and phone number. At least one field must be provided.',
  })
  @ApiBody({
    type: UpdateProfileDto,
    description: 'Profile fields to update',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
    type: UserProfileDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async updateProfile(
    @Request() req: AuthenticatedRequest,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<UserProfileDto> {
    return this.userService.updateProfile(req.user.userId, updateProfileDto);
  }

  /**
   * Change user password
   */
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Change user password',
    description:
      'Change user password by verifying the current password first. New password must meet security requirements.',
  })
  @ApiBody({
    type: ChangePasswordDto,
    description: 'Current and new password details',
  })
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully',
    schema: {
      properties: {
        message: {
          type: 'string',
          example: 'Password changed successfully',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or password requirements not met',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized or incorrect password',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async changePassword(
    @Request() req: AuthenticatedRequest,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    return this.userService.changePassword(req.user.userId, changePasswordDto);
  }

  /**
   * Delete user account
   */
  @Delete('account')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete user account',
    description:
      'Permanently delete the user account (soft delete). Requires password confirmation. This action is irreversible.',
  })
  @ApiBody({
    schema: {
      properties: {
        password: {
          type: 'string',
          example: 'CurrentPassword123!',
          description: 'User password for confirmation',
        },
      },
    },
    description: 'Password confirmation',
  })
  @ApiResponse({
    status: 200,
    description: 'Account deleted successfully',
    schema: {
      properties: {
        message: {
          type: 'string',
          example: 'Account deleted successfully',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized or incorrect password',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async deleteAccount(
    @Request() req: AuthenticatedRequest,
    @Body() body: { password: string },
  ): Promise<{ message: string }> {
    return this.userService.deleteAccount(req.user.userId, body.password);
  }

  /**
   * Get user statistics
   */
  @Get('stats')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get user statistics',
    description:
      'Retrieve comprehensive statistics including portfolio count, investments, and overall performance.',
  })
  @ApiResponse({
    status: 200,
    description: 'User statistics retrieved successfully',
    type: Object,
    schema: {
      properties: {
        userId: {
          type: 'string',
          example: 'clnxx123xxx',
          description: 'User ID',
        },
        email: {
          type: 'string',
          example: 'user@example.com',
          description: 'User email',
        },
        totalPortfolios: {
          type: 'number',
          example: 5,
          description: 'Total number of portfolios',
        },
        totalInvestments: {
          type: 'number',
          example: 25,
          description: 'Total number of investments',
        },
        totalTransactions: {
          type: 'number',
          example: 150,
          description: 'Total number of transactions',
        },
        totalInvested: {
          type: 'number',
          example: 500000,
          description: 'Total amount invested',
        },
        totalCurrentValue: {
          type: 'number',
          example: 625000,
          description: 'Current total portfolio value',
        },
        totalGainLoss: {
          type: 'number',
          example: 125000,
          description: 'Total gain or loss',
        },
        gainLossPercentage: {
          type: 'string',
          example: '25.00',
          description: 'Overall gain/loss percentage',
        },
        memberSince: {
          type: 'string',
          example: '2024-01-15T10:00:00Z',
          description: 'Account creation date',
          format: 'date-time',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async getStats(@Request() req: AuthenticatedRequest): Promise<IUserStats> {
    return this.userService.getUserStats(req.user.userId);
  }
}
