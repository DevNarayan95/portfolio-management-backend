// import { Test, TestingModule } from '@nestjs/testing';
// import { BadRequestException, NotFoundException } from '@nestjs/common';
// import { InvestmentService } from './investment.service';
// import { PrismaService } from '../../../common/prisma/prisma.service';
// import {
//   CreateInvestmentDto,
//   InvestmentTypeEnum,
// } from '../dtos/create-investment.dto';

// describe('InvestmentService', () => {
//   let service: InvestmentService;
//   let prismaService: PrismaService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         InvestmentService,
//         {
//           provide: PrismaService,
//           useValue: {
//             portfolio: {
//               findUnique: jest.fn(),
//             },
//             investment: {
//               create: jest.fn(),
//               findUnique: jest.fn(),
//               findMany: jest.fn(),
//               update: jest.fn(),
//             },
//             transaction: {
//               findMany: jest.fn(),
//             },
//           },
//         },
//       ],
//     }).compile();

//     service = module.get<InvestmentService>(InvestmentService);
//     prismaService = module.get<PrismaService>(PrismaService);
//   });

//   describe('createInvestment', () => {
//     it('should create regular investment', async () => {
//       const userId = 'user-1';
//       const portfolioId = 'portfolio-1';
//       const createInvestmentDto: CreateInvestmentDto = {
//         type: InvestmentTypeEnum.MUTUAL_FUND,
//         name: 'Test Fund',
//         quantity: 10,
//         purchasePrice: 2500,
//         currentPrice: 2750,
//         purchaseDate: new Date('2024-01-15'),
//       };

//       const mockPortfolio = {
//         id: portfolioId,
//         userId,
//       };

//       const mockInvestment = {
//         id: 'inv-1',
//         portfolioId,
//         ...createInvestmentDto,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       };

//       jest
//         .spyOn(prismaService.portfolio, 'findUnique')
//         .mockResolvedValueOnce(mockPortfolio);
//       jest
//         .spyOn(prismaService.investment, 'create')
//         .mockResolvedValueOnce(mockInvestment);

//       const result = await service.createInvestment(
//         userId,
//         portfolioId,
//         createInvestmentDto,
//       );

//       expect(result.name).toEqual(createInvestmentDto.name);
//       expect(result.type).toEqual(createInvestmentDto.type);
//     });

//     it('should create SIP investment', async () => {
//       const userId = 'user-1';
//       const portfolioId = 'portfolio-1';
//       const createInvestmentDto: CreateInvestmentDto = {
//         type: InvestmentTypeEnum.MUTUAL_FUND,
//         name: 'SIP Fund',
//         quantity: 50,
//         purchasePrice: 1500,
//         currentPrice: 1600,
//         purchaseDate: new Date('2024-01-01'),
//         isSIP: true,
//         sipAmount: 5000,
//         sipStartDate: new Date('2024-01-01'),
//         sipDuration: 60,
//       };

//       const mockPortfolio = {
//         id: portfolioId,
//         userId,
//       };

//       jest
//         .spyOn(prismaService.portfolio, 'findUnique')
//         .mockResolvedValueOnce(mockPortfolio);
//       jest.spyOn(prismaService.investment, 'create').mockResolvedValueOnce({
//         id: 'inv-1',
//         portfolioId,
//         ...createInvestmentDto,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       });

//       const result = await service.createInvestment(
//         userId,
//         portfolioId,
//         createInvestmentDto,
//       );

//       expect(result.isSIP).toEqual(true);
//       expect(result.sipAmount).toEqual(5000);
//     });

//     it('should throw BadRequestException for invalid SIP', async () => {
//       const userId = 'user-1';
//       const portfolioId = 'portfolio-1';
//       const createInvestmentDto: CreateInvestmentDto = {
//         type: InvestmentTypeEnum.MUTUAL_FUND,
//         name: 'SIP Fund',
//         quantity: 50,
//         purchasePrice: 1500,
//         currentPrice: 1600,
//         purchaseDate: new Date('2024-01-01'),
//         isSIP: true,
//         // Missing sipAmount, sipStartDate, sipDuration
//       };

//       const mockPortfolio = {
//         id: portfolioId,
//         userId,
//       };

//       jest
//         .spyOn(prismaService.portfolio, 'findUnique')
//         .mockResolvedValueOnce(mockPortfolio);

//       await expect(
//         service.createInvestment(userId, portfolioId, createInvestmentDto),
//       ).rejects.toThrow(BadRequestException);
//     });
//   });
// });
