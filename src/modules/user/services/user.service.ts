// // src/modules/user/services/user.service.ts
// import {
//   Injectable,
//   NotFoundException,
//   BadRequestException,
//   UnauthorizedException,
//   Logger,
// } from '@nestjs/common';
// import { UserRepository } from '../repositories/user.repository';
// import { UpdateProfileDto, ChangePasswordDto } from '../dtos';
// import { IUserProfile, IUserStats } from '../interfaces/user.interface';
// import * as bcrypt from 'bcrypt';

// @Injectable()
// export class UserService {
//   private readonly logger = new Logger(UserService.name);

//   constructor(private userRepository: UserRepository) {}

//   /**
//    * Get user profile
//    */
//   async getUserProfile(userId: string): Promise<IUserProfile> {
//     const user = await this.userRepository.getUserProfile(userId);

//     if (!user) {
//       throw new NotFoundException('User not found');
//     }

//     return user;
//   }

//   /**
//    * Update user profile
//    */
//   async updateProfile(
//     userId: string,
//     updateProfileDto: UpdateProfileDto,
//   ): Promise<IUserProfile> {
//     const user = await this.userRepository.findById(userId);

//     if (!user) {
//       throw new NotFoundException('User not found');
//     }

//     // Validate update payload
//     if (
//       !updateProfileDto.firstName &&
//       !updateProfileDto.lastName &&
//       !updateProfileDto.phone
//     ) {
//       throw new BadRequestException(
//         'At least one field must be provided for update',
//       );
//     }

//     const updated = await this.userRepository.updateProfile(userId, {
//       firstName: updateProfileDto.firstName,
//       lastName: updateProfileDto.lastName,
//       phone: updateProfileDto.phone,
//     });

//     return updated;
//   }

//   /**
//    * Change user password
//    */
//   async changePassword(
//     userId: string,
//     changePasswordDto: ChangePasswordDto,
//   ): Promise<{ message: string }> {
//     const user = await this.userRepository.findById(userId);

//     if (!user) {
//       throw new NotFoundException('User not found');
//     }

//     // Verify current password
//     const isPasswordValid = await bcrypt.compare(
//       changePasswordDto.currentPassword,
//       user.password,
//     );

//     if (!isPasswordValid) {
//       throw new UnauthorizedException('Current password is incorrect');
//     }

//     // Check passwords match
//     if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
//       throw new BadRequestException('New passwords do not match');
//     }

//     // Check new password is different from current
//     if (changePasswordDto.currentPassword === changePasswordDto.newPassword) {
//       throw new BadRequestException(
//         'New password must be different from current password',
//       );
//     }

//     // Hash new password
//     const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);

//     // Update password
//     await this.userRepository.updatePassword(userId, hashedPassword);

//     this.logger.log(`Password changed for user: ${userId}`);

//     return { message: 'Password changed successfully' };
//   }

//   /**
//    * Delete user account
//    */
//   async deleteAccount(
//     userId: string,
//     password: string,
//   ): Promise<{ message: string }> {
//     const user = await this.userRepository.findById(userId);

//     if (!user) {
//       throw new NotFoundException('User not found');
//     }

//     // Verify password
//     const isPasswordValid = await bcrypt.compare(password, user.password);

//     if (!isPasswordValid) {
//       throw new UnauthorizedException('Incorrect password');
//     }

//     // Soft delete user
//     await this.userRepository.deleteAccount(userId);

//     this.logger.log(`Account deleted for user: ${userId}`);

//     return { message: 'Account deleted successfully' };
//   }

//   /**
//    * Get user statistics
//    */
//   async getUserStats(userId: string): Promise<IUserStats> {
//     const user = await this.userRepository.getUserWithPortfolios(userId);

//     if (!user) {
//       throw new NotFoundException('User not found');
//     }

//     let totalPortfolios = 0;
//     let totalInvestments = 0;
//     let totalTransactions = 0;
//     let totalInvested = 0;
//     let totalCurrentValue = 0;

//     user.portfolios.forEach(
//       (portfolio: {
//         investments: Array<{
//           quantity: number;
//           purchasePrice: number;
//           currentPrice: number;
//         }>;
//         transactions: any[];
//       }) => {
//         totalPortfolios++;
//         totalTransactions += portfolio.transactions.length;

//         portfolio.investments.forEach(
//           (inv: {
//             quantity: number;
//             purchasePrice: number;
//             currentPrice: number;
//           }) => {
//             totalInvestments++;
//             const investmentValue = inv.quantity * inv.purchasePrice;
//             const currentValue = inv.quantity * inv.currentPrice;
//             totalInvested += investmentValue;
//             totalCurrentValue += currentValue;
//           },
//         );
//       },
//     );

//     const totalGainLoss = totalCurrentValue - totalInvested;
//     const gainLossPercentage =
//       totalInvested > 0
//         ? ((totalGainLoss / totalInvested) * 100).toFixed(2)
//         : '0.00';

//     return {
//       userId: user.id,
//       email: user.email,
//       totalPortfolios,
//       totalInvestments,
//       totalTransactions,
//       totalInvested,
//       totalCurrentValue,
//       totalGainLoss,
//       gainLossPercentage,
//       memberSince: user.createdAt,
//     };
//   }
// }
