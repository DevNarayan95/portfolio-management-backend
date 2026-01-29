import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Investment, InvestmentType } from '@prisma/client';
import {
  IInvestment,
  ICreateInvestmentPayload,
  IUpdateInvestmentPayload,
} from '../interfaces/investment.interface';

interface InvestmentWithTransactions extends Investment {
  transactions: unknown[];
}

@Injectable()
export class InvestmentRepository {
  private readonly logger = new Logger(InvestmentRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new investment
   * @param payload Investment creation payload
   * @returns Created investment
   */
  async create(payload: ICreateInvestmentPayload): Promise<IInvestment> {
    try {
      return await this.prisma.investment.create({
        data: {
          portfolioId: payload.portfolioId,
          type: payload.type as InvestmentType,
          name: payload.name,
          symbol: payload.symbol || null,
          quantity: payload.quantity,
          purchasePrice: payload.purchasePrice,
          currentPrice: payload.currentPrice,
          purchaseDate: payload.purchaseDate,
          notes: payload.notes || null,
          isSIP: payload.isSIP || false,
          sipAmount: payload.sipAmount || null,
          sipStartDate: payload.sipStartDate || null,
          sipDuration: payload.sipDuration || null,
        },
      });
    } catch (error) {
      this.logger.error(
        `Error creating investment for portfolio: ${payload.portfolioId}`,
        error,
      );
      throw error;
    }
  }

  /**
   * Find investment by ID
   * @param investmentId Investment ID
   * @returns Investment object or null if not found
   */
  async findById(investmentId: string): Promise<IInvestment | null> {
    try {
      return await this.prisma.investment.findUnique({
        where: { id: investmentId },
      });
    } catch (error) {
      this.logger.error(
        `Error finding investment by ID: ${investmentId}`,
        error,
      );
      throw error;
    }
  }

  /**
   * Find all investments for a portfolio
   * @param portfolioId Portfolio ID
   * @returns Array of investments
   */
  async findByPortfolioId(portfolioId: string): Promise<IInvestment[]> {
    try {
      return await this.prisma.investment.findMany({
        where: {
          portfolioId,
          deletedAt: null,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      this.logger.error(
        `Error finding investments for portfolio: ${portfolioId}`,
        error,
      );
      throw error;
    }
  }

  /**
   * Update investment
   * @param investmentId Investment ID
   * @param payload Update payload
   * @returns Updated investment
   */
  async update(
    investmentId: string,
    payload: IUpdateInvestmentPayload,
  ): Promise<IInvestment> {
    try {
      return await this.prisma.investment.update({
        where: { id: investmentId },
        data: {
          name: payload.name,
          currentPrice: payload.currentPrice,
          notes: payload.notes,
          sipAmount: payload.sipAmount,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      this.logger.error(`Error updating investment: ${investmentId}`, error);
      throw error;
    }
  }

  /**
   * Soft delete investment
   * @param investmentId Investment ID
   * @returns void
   */
  async delete(investmentId: string): Promise<void> {
    try {
      await this.prisma.investment.update({
        where: { id: investmentId },
        data: {
          deletedAt: new Date(),
        },
      });
    } catch (error) {
      this.logger.error(`Error deleting investment: ${investmentId}`, error);
      throw error;
    }
  }

  /**
   * Get investment with transactions
   * @param investmentId Investment ID
   * @returns Investment with transactions
   */
  async findByIdWithTransactions(
    investmentId: string,
  ): Promise<InvestmentWithTransactions | null> {
    try {
      return await this.prisma.investment.findUnique({
        where: { id: investmentId },
        include: {
          transactions: {
            orderBy: {
              transactionDate: 'asc',
            },
          },
        },
      });
    } catch (error) {
      this.logger.error(
        `Error finding investment with transactions: ${investmentId}`,
        error,
      );
      throw error;
    }
  }

  /**
   * Get transactions for investment
   * @param investmentId Investment ID
   * @returns Array of transactions
   */
  async getTransactions(investmentId: string): Promise<unknown[]> {
    try {
      return await this.prisma.transaction.findMany({
        where: {
          investmentId,
        },
        orderBy: {
          transactionDate: 'asc',
        },
      });
    } catch (error) {
      this.logger.error(
        `Error fetching transactions for investment: ${investmentId}`,
        error,
      );
      throw error;
    }
  }
}
