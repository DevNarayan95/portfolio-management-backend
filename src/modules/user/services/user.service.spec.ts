// import { Test, TestingModule } from '@nestjs/testing';
// import {
//   NotFoundException,
//   UnauthorizedException,
//   BadRequestException,
// } from '@nestjs/common';
// import { UserService } from './user.service';
// import { PrismaService } from '../../../common/prisma/prisma.service';
// import * as bcrypt from 'bcrypt';

// jest.mock('bcrypt');

// describe('UserService', () => {
//   let service: UserService;
//   let prismaService: PrismaService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         UserService,
//         {
//           provide: PrismaService,
//           useValue: {
//             user: {
//               findUnique: jest.fn(),
//               update: jest.fn(),
//             },
//           },
//         },
//       ],
//     }).compile();

//     service = module.get<UserService>(UserService);
//     prismaService = module.get<PrismaService>(PrismaService);
//   });

//   describe('getUserProfile', () => {
//     it('should return user profile', async () => {
//       const userId = 'user-1';
//       const mockUser = {
//         id: userId,
//         email: 'user@example.com',
//         firstName: 'John',
//         lastName: 'Doe',
//         phone: '+1234567890',
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       };

//       jest
//         .spyOn(prismaService.user, 'findUnique')
//         .mockResolvedValueOnce(mockUser);

//       const result = await service.getUserProfile(userId);

//       expect(result.id).toEqual(userId);
//       expect(result.email).toEqual(mockUser.email);
//     });

//     it('should throw NotFoundException if user not found', async () => {
//       jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce(null);

//       await expect(service.getUserProfile('invalid-id')).rejects.toThrow(
//         NotFoundException,
//       );
//     });
//   });

//   describe('changePassword', () => {
//     it('should change password successfully', async () => {
//       const userId = 'user-1';
//       const mockUser = {
//         id: userId,
//         email: 'user@example.com',
//         password: 'hashed-old-password',
//       };

//       jest
//         .spyOn(prismaService.user, 'findUnique')
//         .mockResolvedValueOnce(mockUser);
//       jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true as never);
//       jest
//         .spyOn(bcrypt, 'hash')
//         .mockResolvedValueOnce('hashed-new-password' as never);
//       jest.spyOn(prismaService.user, 'update').mockResolvedValueOnce(mockUser);

//       const result = await service.changePassword(userId, {
//         currentPassword: 'OldPassword123!',
//         newPassword: 'NewPassword123!',
//         confirmPassword: 'NewPassword123!',
//       });

//       expect(result.message).toContain('successfully');
//       expect(prismaService.user.update).toHaveBeenCalled();
//     });

//     it('should throw UnauthorizedException for incorrect current password', async () => {
//       const userId = 'user-1';
//       const mockUser = {
//         id: userId,
//         password: 'hashed-password',
//       };

//       jest
//         .spyOn(prismaService.user, 'findUnique')
//         .mockResolvedValueOnce(mockUser);
//       jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false as never);

//       await expect(
//         service.changePassword(userId, {
//           currentPassword: 'WrongPassword123!',
//           newPassword: 'NewPassword123!',
//           confirmPassword: 'NewPassword123!',
//         }),
//       ).rejects.toThrow(UnauthorizedException);
//     });

//     it('should throw BadRequestException if passwords do not match', async () => {
//       const userId = 'user-1';
//       const mockUser = {
//         id: userId,
//         password: 'hashed-password',
//       };

//       jest
//         .spyOn(prismaService.user, 'findUnique')
//         .mockResolvedValueOnce(mockUser);
//       jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true as never);

//       await expect(
//         service.changePassword(userId, {
//           currentPassword: 'OldPassword123!',
//           newPassword: 'NewPassword123!',
//           confirmPassword: 'DifferentPassword123!',
//         }),
//       ).rejects.toThrow(BadRequestException);
//     });
//   });

//   describe('getUserStats', () => {
//     it('should return user statistics', async () => {
//       const userId = 'user-1';
//       const mockUser = {
//         id: userId,
//         email: 'user@example.com',
//         createdAt: new Date(),
//         portfolios: [
//           {
//             id: 'portfolio-1',
//             transactions: [{ id: 'tx-1' }, { id: 'tx-2' }],
//             investments: [
//               {
//                 id: 'inv-1',
//                 quantity: 10,
//                 purchasePrice: 100,
//                 currentPrice: 120,
//               },
//             ],
//           },
//         ],
//       };

//       jest
//         .spyOn(prismaService.user, 'findUnique')
//         .mockResolvedValueOnce(mockUser);

//       const result = await service.getUserStats(userId);

//       expect(result.userId).toEqual(userId);
//       expect(result.totalPortfolios).toEqual(1);
//       expect(result.totalInvestments).toEqual(1);
//       expect(result.totalTransactions).toEqual(2);
//     });
//   });
// });
