// import { Test, TestingModule } from '@nestjs/testing';
// import { BadRequestException, NotFoundException } from '@nestjs/common';
// import { TransactionService } from './transaction.service';
// import { PrismaService } from '../../../common/prisma/prisma.service';
// import { CreateTransactionDto } from '../dtos/create-transaction.dto';

// describe('TransactionService', () => {
//   let service: TransactionService;
//   let prismaService: PrismaService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         TransactionService,
//         {
//           provide: PrismaService,
//           useValue: {
//             portfolio: {
//               findUnique: jest.fn(),
//             },
//             investment: {
//               findUnique: jest.fn(),
//             },
//             transaction: {
//               create: jest.fn(),
//               findMany: jest.fn(),
//               findUnique: jest.fn(),
//               count: jest.fn(),
//             },
//           },
//         },
//       ],
//     }).compile();

//     service = module.get<TransactionService>(TransactionService);
//     prismaService = module.get<PrismaService>(PrismaService);
//   });

//   describe('createTransaction', () => {
//     it('should create transaction successfully', async () => {
//       const userId = 'user-1';
//       const portfolioId = 'portfolio-1';
//       const investmentId = 'inv-1';
//       const createTransactionDto: CreateTransactionDto = {
//         type: 'BUY' as any,
//         quantity: 10,
//         price: 2500,
//         amount: 25000,
//         transactionDate: new Date('2024-01-20'),
//       };

//       const mockPortfolio = {
//         id: portfolioId,
//         userId,
//       };

//       const mockInvestment = {
//         id: investmentId,
//         portfolioId,
//         deletedAt: null,
//       };

//       const mockTransaction = {
//         id: 'tx-1',
//         investmentId,
//         portfolioId,
//         ...createTransactionDto,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       };

//       jest
//         .spyOn(prismaService.portfolio, 'findUnique')
//         .mockResolvedValueOnce(mockPortfolio);
//       jest
//         .spyOn(prismaService.investment, 'findUnique')
//         .mockResolvedValueOnce(mockInvestment);
//       jest
//         .spyOn(prismaService.transaction, 'create')
//         .mockResolvedValueOnce(mockTransaction);

//       const result = await service.createTransaction(
//         userId,
//         portfolioId,
//         investmentId,
//         createTransactionDto,
//       );

//       expect(result.quantity).toEqual(createTransactionDto.quantity);
//       expect(result.amount).toEqual(createTransactionDto.amount);
//     });

//     it('should throw BadRequestException for amount mismatch', async () => {
//       const userId = 'user-1';
//       const portfolioId = 'portfolio-1';
//       const investmentId = 'inv-1';
//       const createTransactionDto: CreateTransactionDto = {
//         type: 'BUY' as any,
//         quantity: 10,
//         price: 2500,
//         amount: 30000, // Wrong amount (should be 25000)
//         transactionDate: new Date('2024-01-20'),
//       };

//       const mockPortfolio = {
//         id: portfolioId,
//         userId,
//       };

//       const mockInvestment = {
//         id: investmentId,
//         portfolioId,
//         deletedAt: null,
//       };

//       jest
//         .spyOn(prismaService.portfolio, 'findUnique')
//         .mockResolvedValueOnce(mockPortfolio);
//       jest
//         .spyOn(prismaService.investment, 'findUnique')
//         .mockResolvedValueOnce(mockInvestment);

//       await expect(
//         service.createTransaction(
//           userId,
//           portfolioId,
//           investmentId,
//           createTransactionDto,
//         ),
//       ).rejects.toThrow(BadRequestException);
//     });
//   });
// });
