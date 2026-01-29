// // src/modules/user/repositories/user.repository.ts
// import { Injectable, Logger } from '@nestjs/common';
// import { PrismaService } from '../../../prisma/prisma.service';
// import { User } from '@prisma/client';
// import {
//   IUserProfile,
//   IUpdateProfilePayload,
// } from '../interfaces/user.interface';

// interface UserWithPortfolios extends User {
//   portfolios: any[];
// }

// @Injectable()
// export class UserRepository {
//   private readonly logger = new Logger(UserRepository.name);

//   constructor(private readonly prisma: PrismaService) {}

//   /**
//    * Find user by ID
//    * @param userId User ID
//    * @returns User or null
//    */
//   async findById(userId: string): Promise<User | null> {
//     try {
//       return await this.prisma.user.findUnique({
//         where: { id: userId },
//       });
//     } catch (error) {
//       this.logger.error(`Error finding user by ID: ${userId}`, error);
//       throw error;
//     }
//   }

//   /**
//    * Get user profile
//    * @param userId User ID
//    * @returns User profile
//    */
//   async getUserProfile(userId: string): Promise<IUserProfile | null> {
//     try {
//       return await this.prisma.user.findUnique({
//         where: { id: userId },
//         select: {
//           id: true,
//           email: true,
//           firstName: true,
//           lastName: true,
//           phone: true,
//           createdAt: true,
//           updatedAt: true,
//         },
//       });
//     } catch (error) {
//       this.logger.error(`Error fetching user profile: ${userId}`, error);
//       throw error;
//     }
//   }

//   /**
//    * Update user profile
//    * @param userId User ID
//    * @param payload Update payload
//    * @returns Updated user profile
//    */
//   async updateProfile(
//     userId: string,
//     payload: IUpdateProfilePayload,
//   ): Promise<IUserProfile> {
//     try {
//       return await this.prisma.user.update({
//         where: { id: userId },
//         data: {
//           firstName: payload.firstName,
//           lastName: payload.lastName,
//           phone: payload.phone,
//           updatedAt: new Date(),
//         },
//         select: {
//           id: true,
//           email: true,
//           firstName: true,
//           lastName: true,
//           phone: true,
//           createdAt: true,
//           updatedAt: true,
//         },
//       });
//     } catch (error) {
//       this.logger.error(`Error updating user profile: ${userId}`, error);
//       throw error;
//     }
//   }

//   /**
//    * Update user password
//    * @param userId User ID
//    * @param hashedPassword Hashed password
//    * @returns void
//    */
//   async updatePassword(userId: string, hashedPassword: string): Promise<void> {
//     try {
//       await this.prisma.user.update({
//         where: { id: userId },
//         data: {
//           password: hashedPassword,
//           updatedAt: new Date(),
//         },
//       });
//     } catch (error) {
//       this.logger.error(`Error updating password for user: ${userId}`, error);
//       throw error;
//     }
//   }

//   /**
//    * Soft delete user account
//    * @param userId User ID
//    * @returns void
//    */
//   async deleteAccount(userId: string): Promise<void> {
//     try {
//       await this.prisma.user.update({
//         where: { id: userId },
//         data: {
//           deletedAt: new Date(),
//         },
//       });
//     } catch (error) {
//       this.logger.error(`Error deleting account for user: ${userId}`, error);
//       throw error;
//     }
//   }

//   /**
//    * Get user with portfolios and investments
//    * @param userId User ID
//    * @returns User with portfolios
//    */
//   async getUserWithPortfolios(
//     userId: string,
//   ): Promise<UserWithPortfolios | null> {
//     try {
//       return await this.prisma.user.findUnique({
//         where: { id: userId },
//         include: {
//           portfolios: {
//             where: { deletedAt: null },
//             include: {
//               investments: {
//                 where: { deletedAt: null },
//               },
//               transactions: true,
//             },
//           },
//         },
//       });
//     } catch (error) {
//       this.logger.error(
//         `Error fetching user with portfolios: ${userId}`,
//         error,
//       );
//       throw error;
//     }
//   }
// }
