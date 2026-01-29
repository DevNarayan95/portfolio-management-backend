// // src/modules/transaction/repositories/transaction.repository.ts
// import { Injectable, Logger } from '@nestjs/common';
// import { PrismaService } from '../../../prisma/prisma.service';
// import { TransactionType } from '@prisma/client';
// import {
//   ITransaction,
//   ICreateTransactionPayload,
// } from '../interfaces/transaction.interface';

// @Injectable()
// export class TransactionRepository {
//   private readonly logger = new Logger(TransactionRepository.name);

//   constructor(private readonly prisma: PrismaService) {}

//   /**
//    * Create a new transaction
//    * @param payload Transaction creation payload
//    * @returns Created transaction
//    */
//   async create(payload: ICreateTransactionPayload): Promise<ITransaction> {
//     try {
//       return await this.prisma.transaction.create({
//         data: {
//           investmentId: payload.investmentId,
//           portfolioId: payload.portfolioId,
//           type: payload.type as TransactionType,
//           quantity: payload.quantity,
//           price: payload.price,
//           amount: payload.amount,
//           transactionDate: payload.transactionDate,
//           notes: payload.notes || null,
//         },
//       });
//     } catch (error) {
//       this.logger.error(
//         `Error creating transaction for investment: ${payload.investmentId}`,
//         error,
//       );
//       throw error;
//     }
//   }

//   /**
//    * Find transaction by ID
//    * @param transactionId Transaction ID
//    * @returns Transaction or null if not found
//    */
//   async findById(transactionId: string): Promise<ITransaction | null> {
//     try {
//       return await this.prisma.transaction.findUnique({
//         where: { id: transactionId },
//       });
//     } catch (error) {
//       this.logger.error(
//         `Error finding transaction by ID: ${transactionId}`,
//         error,
//       );
//       throw error;
//     }
//   }

//   /**
//    * Find transactions by portfolio ID with pagination
//    * @param portfolioId Portfolio ID
//    * @param skip Skip count
//    * @param take Take count
//    * @param where Additional where conditions
//    * @returns Array of transactions
//    */
//   async findByPortfolioId(
//     portfolioId: string,
//     skip: number,
//     take: number,
//     where?: Record<string, unknown>,
//   ): Promise<ITransaction[]> {
//     try {
//       return await this.prisma.transaction.findMany({
//         where: {
//           portfolioId,
//           ...where,
//         },
//         skip,
//         take,
//         orderBy: {
//           transactionDate: 'desc',
//         },
//       });
//     } catch (error) {
//       this.logger.error(
//         `Error finding transactions for portfolio: ${portfolioId}`,
//         error,
//       );
//       throw error;
//     }
//   }

//   /**
//    * Count transactions by portfolio ID
//    * @param portfolioId Portfolio ID
//    * @param where Additional where conditions
//    * @returns Count of transactions
//    */
//   async countByPortfolioId(
//     portfolioId: string,
//     where?: Record<string, unknown>,
//   ): Promise<number> {
//     try {
//       return await this.prisma.transaction.count({
//         where: {
//           portfolioId,
//           ...where,
//         },
//       });
//     } catch (error) {
//       this.logger.error(
//         `Error counting transactions for portfolio: ${portfolioId}`,
//         error,
//       );
//       throw error;
//     }
//   }

//   /**
//    * Find transactions by investment ID with pagination
//    * @param investmentId Investment ID
//    * @param skip Skip count
//    * @param take Take count
//    * @param where Additional where conditions
//    * @returns Array of transactions
//    */
//   async findByInvestmentId(
//     investmentId: string,
//     skip: number,
//     take: number,
//     where?: Record<string, unknown>,
//   ): Promise<ITransaction[]> {
//     try {
//       return await this.prisma.transaction.findMany({
//         where: {
//           investmentId,
//           ...where,
//         },
//         skip,
//         take,
//         orderBy: {
//           transactionDate: 'desc',
//         },
//       });
//     } catch (error) {
//       this.logger.error(
//         `Error finding transactions for investment: ${investmentId}`,
//         error,
//       );
//       throw error;
//     }
//   }

//   /**
//    * Count transactions by investment ID
//    * @param investmentId Investment ID
//    * @param where Additional where conditions
//    * @returns Count of transactions
//    */
//   async countByInvestmentId(
//     investmentId: string,
//     where?: Record<string, unknown>,
//   ): Promise<number> {
//     try {
//       return await this.prisma.transaction.count({
//         where: {
//           investmentId,
//           ...where,
//         },
//       });
//     } catch (error) {
//       this.logger.error(
//         `Error counting transactions for investment: ${investmentId}`,
//         error,
//       );
//       throw error;
//     }
//   }

//   /**
//    * Find all transactions by portfolio ID (no pagination)
//    * @param portfolioId Portfolio ID
//    * @returns Array of all transactions
//    */
//   async findAllByPortfolioId(portfolioId: string): Promise<ITransaction[]> {
//     try {
//       return await this.prisma.transaction.findMany({
//         where: { portfolioId },
//         orderBy: {
//           transactionDate: 'desc',
//         },
//       });
//     } catch (error) {
//       this.logger.error(
//         `Error finding all transactions for portfolio: ${portfolioId}`,
//         error,
//       );
//       throw error;
//     }
//   }
// }
