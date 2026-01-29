// // src/modules/transaction/services/transaction.service.ts
// import {
//   Injectable,
//   NotFoundException,
//   ForbiddenException,
//   BadRequestException,
//   Logger,
// } from '@nestjs/common';
// import { TransactionRepository } from '../repositories/transaction.repository';
// import { PortfolioRepository } from '../../portfolio/repositories/portfolio.repository';
// import { InvestmentRepository } from '../../investment/repositories/investment.repository';
// import {
//   CreateTransactionDto,
//   TransactionResponseDto,
//   FilterTransactionDto,
// } from '../dtos';
// import {
//   ITransaction,
//   ITransactionAnalytics,
//   ITransactionPaginated,
// } from '../interfaces/transaction.interface';

// @Injectable()
// export class TransactionService {
//   private readonly logger = new Logger(TransactionService.name);

//   constructor(
//     private transactionRepository: TransactionRepository,
//     private portfolioRepository: PortfolioRepository,
//     private investmentRepository: InvestmentRepository,
//   ) {}

//   /**
//    * Create a new transaction
//    */
//   async createTransaction(
//     userId: string,
//     portfolioId: string,
//     investmentId: string,
//     createTransactionDto: CreateTransactionDto,
//   ): Promise<TransactionResponseDto> {
//     // Verify portfolio ownership
//     const portfolio = await this.portfolioRepository.findById(portfolioId);
//     if (!portfolio) {
//       throw new NotFoundException('Portfolio not found');
//     }
//     if (portfolio.userId !== userId) {
//       throw new ForbiddenException('You do not have access to this portfolio');
//     }

//     // Verify investment exists and belongs to portfolio
//     const investment = await this.investmentRepository.findById(investmentId);
//     if (!investment) {
//       throw new NotFoundException('Investment not found');
//     }
//     if (investment.portfolioId !== portfolioId) {
//       throw new BadRequestException(
//         'Investment does not belong to this portfolio',
//       );
//     }
//     if (investment.deletedAt) {
//       throw new NotFoundException('Investment not found');
//     }

//     // Validate amount calculation
//     const calculatedAmount =
//       createTransactionDto.quantity * createTransactionDto.price;
//     if (Math.abs(calculatedAmount - createTransactionDto.amount) > 0.01) {
//       throw new BadRequestException(
//         'Transaction amount does not match quantity * price calculation',
//       );
//     }

//     // Validate transaction type
//     if (!['BUY', 'SELL'].includes(createTransactionDto.type)) {
//       throw new BadRequestException('Invalid transaction type');
//     }

//     // Validate quantity
//     if (createTransactionDto.quantity <= 0) {
//       throw new BadRequestException('Quantity must be greater than 0');
//     }

//     // Validate price
//     if (createTransactionDto.price < 0) {
//       throw new BadRequestException('Price cannot be negative');
//     }

//     const transaction = await this.transactionRepository.create({
//       investmentId,
//       portfolioId,
//       type: createTransactionDto.type,
//       quantity: createTransactionDto.quantity,
//       price: createTransactionDto.price,
//       amount: createTransactionDto.amount,
//       transactionDate: createTransactionDto.transactionDate,
//       notes: createTransactionDto.notes,
//     });

//     return this.mapToResponseDto(transaction);
//   }

//   /**
//    * Get transactions by portfolio with pagination and filters
//    */
//   async getTransactionsByPortfolio(
//     userId: string,
//     portfolioId: string,
//     filterDto: FilterTransactionDto,
//   ): Promise<ITransactionPaginated> {
//     // Verify portfolio ownership
//     const portfolio = await this.portfolioRepository.findById(portfolioId);
//     if (!portfolio) {
//       throw new NotFoundException('Portfolio not found');
//     }
//     if (portfolio.userId !== userId) {
//       throw new ForbiddenException('You do not have access to this portfolio');
//     }

//     const page = filterDto.page || 1;
//     const limit = filterDto.limit || 10;
//     const skip = (page - 1) * limit;

//     // Build where clause
//     const where: Record<string, any> = {};
//     if (filterDto.type) {
//       where.type = filterDto.type;
//     }
//     if (filterDto.fromDate || filterDto.toDate) {
//       where.transactionDate = {} as { gte?: Date; lte?: Date };
//       if (filterDto.fromDate) {
//         (where.transactionDate as { gte?: Date }).gte = filterDto.fromDate;
//       }
//       if (filterDto.toDate) {
//         (where.transactionDate as { lte?: Date }).lte = filterDto.toDate;
//       }
//     }

//     // Get total count and transactions
//     const total = await this.transactionRepository.countByPortfolioId(
//       portfolioId,
//       where,
//     );
//     const transactions = await this.transactionRepository.findByPortfolioId(
//       portfolioId,
//       skip,
//       limit,
//       where,
//     );

//     return {
//       data: transactions.map((t) => this.mapToResponseDto(t)),
//       total,
//       page,
//       limit,
//       totalPages: Math.ceil(total / limit),
//     };
//   }

//   /**
//    * Get transactions by investment with pagination and filters
//    */
//   async getTransactionsByInvestment(
//     userId: string,
//     portfolioId: string,
//     investmentId: string,
//     filterDto: FilterTransactionDto,
//   ): Promise<ITransactionPaginated> {
//     // Verify portfolio ownership
//     const portfolio = await this.portfolioRepository.findById(portfolioId);
//     if (!portfolio) {
//       throw new NotFoundException('Portfolio not found');
//     }
//     if (portfolio.userId !== userId) {
//       throw new ForbiddenException('You do not have access to this portfolio');
//     }

//     // Verify investment exists
//     const investment = await this.investmentRepository.findById(investmentId);
//     if (!investment || investment.portfolioId !== portfolioId) {
//       throw new NotFoundException('Investment not found');
//     }

//     const page = filterDto.page || 1;
//     const limit = filterDto.limit || 10;
//     const skip = (page - 1) * limit;

//     // Build where clause
//     const where: Record<string, any> = {};
//     if (filterDto.type) {
//       where.type = filterDto.type;
//     }
//     if (filterDto.fromDate || filterDto.toDate) {
//       const dateFilter: Record<string, Date> = {};
//       if (filterDto.fromDate) {
//         dateFilter.gte = filterDto.fromDate;
//       }
//       if (filterDto.toDate) {
//         dateFilter.lte = filterDto.toDate;
//       }
//       where.transactionDate = dateFilter;
//     }

//     // Get total count and transactions
//     const total = await this.transactionRepository.countByInvestmentId(
//       investmentId,
//       where,
//     );
//     const transactions = await this.transactionRepository.findByInvestmentId(
//       investmentId,
//       skip,
//       limit,
//       where,
//     );

//     return {
//       data: transactions.map((t) => this.mapToResponseDto(t)),
//       total,
//       page,
//       limit,
//       totalPages: Math.ceil(total / limit),
//     };
//   }

//   /**
//    * Get transaction by ID with authorization
//    */
//   async getTransactionById(
//     userId: string,
//     portfolioId: string,
//     transactionId: string,
//   ): Promise<TransactionResponseDto> {
//     // Verify portfolio ownership
//     const portfolio = await this.portfolioRepository.findById(portfolioId);
//     if (!portfolio) {
//       throw new NotFoundException('Portfolio not found');
//     }
//     if (portfolio.userId !== userId) {
//       throw new ForbiddenException('You do not have access to this portfolio');
//     }

//     const transaction =
//       await this.transactionRepository.findById(transactionId);
//     if (!transaction || transaction.portfolioId !== portfolioId) {
//       throw new NotFoundException('Transaction not found');
//     }

//     return this.mapToResponseDto(transaction);
//   }

//   /**
//    * Get transaction analytics for portfolio
//    */
//   async getTransactionAnalytics(
//     userId: string,
//     portfolioId: string,
//   ): Promise<ITransactionAnalytics> {
//     // Verify portfolio ownership
//     const portfolio = await this.portfolioRepository.findById(portfolioId);
//     if (!portfolio) {
//       throw new NotFoundException('Portfolio not found');
//     }
//     if (portfolio.userId !== userId) {
//       throw new ForbiddenException('You do not have access to this portfolio');
//     }

//     const transactions =
//       await this.transactionRepository.findAllByPortfolioId(portfolioId);

//     const buyTransactions = transactions.filter((t) => t.type === 'BUY');
//     const sellTransactions = transactions.filter((t) => t.type === 'SELL');

//     const totalBuyAmount = buyTransactions.reduce(
//       (sum, t) => sum + t.amount,
//       0,
//     );
//     const totalSellAmount = sellTransactions.reduce(
//       (sum, t) => sum + t.amount,
//       0,
//     );
//     const totalBuyQuantity = buyTransactions.reduce(
//       (sum, t) => sum + t.quantity,
//       0,
//     );
//     const totalSellQuantity = sellTransactions.reduce(
//       (sum, t) => sum + t.quantity,
//       0,
//     );

//     return {
//       totalTransactions: transactions.length,
//       totalBuyTransactions: buyTransactions.length,
//       totalSellTransactions: sellTransactions.length,
//       totalBuyAmount,
//       totalSellAmount,
//       totalBuyQuantity,
//       totalSellQuantity,
//       averageBuyPrice:
//         buyTransactions.length > 0
//           ? (totalBuyAmount / totalBuyQuantity).toFixed(2)
//           : '0.00',
//       averageSellPrice:
//         sellTransactions.length > 0
//           ? (totalSellAmount / totalSellQuantity).toFixed(2)
//           : '0.00',
//     };
//   }

//   /**
//    * Map transaction entity to response DTO
//    */
//   private mapToResponseDto(transaction: ITransaction): TransactionResponseDto {
//     return {
//       id: transaction.id,
//       investmentId: transaction.investmentId,
//       portfolioId: transaction.portfolioId,
//       type: transaction.type,
//       quantity: transaction.quantity,
//       price: transaction.price,
//       amount: transaction.amount,
//       transactionDate: transaction.transactionDate,
//       notes: transaction.notes,
//       createdAt: transaction.createdAt,
//       updatedAt: transaction.updatedAt,
//     };
//   }
// }
