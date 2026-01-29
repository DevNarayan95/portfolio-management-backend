// src/modules/portfolio/repositories/portfolio.repository.ts
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Portfolio, Investment } from '@prisma/client';
import {
  IPortfolio,
  ICreatePortfolioPayload,
  IUpdatePortfolioPayload,
} from '../interfaces/portfolio.interface';

interface PortfolioWithInvestments extends Portfolio {
  investments: Investment[];
}

interface InvestmentWithTransactions extends Investment {
  transactions: unknown[];
}

@Injectable()
export class PortfolioRepository {
  private readonly logger = new Logger(PortfolioRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new portfolio
   * @param payload Portfolio creation payload
   * @returns Created portfolio
   */
  async create(payload: ICreatePortfolioPayload): Promise<IPortfolio> {
    try {
      return await this.prisma.portfolio.create({
        data: {
          userId: payload.userId,
          name: payload.name,
          description: payload.description,
        },
      });
    } catch (error) {
      this.logger.error(
        `Error creating portfolio for user: ${payload.userId}`,
        error,
      );
      throw error;
    }
  }

  /**
   * Find portfolio by ID
   * @param portfolioId Portfolio ID
   * @returns Portfolio object or null if not found
   */
  async findById(portfolioId: string): Promise<IPortfolio | null> {
    try {
      return await this.prisma.portfolio.findUnique({
        where: { id: portfolioId },
      });
    } catch (error) {
      this.logger.error(`Error finding portfolio by ID: ${portfolioId}`, error);
      throw error;
    }
  }

  /**
   * Find all portfolios for a user
   * @param userId User ID
   * @returns Array of portfolios
   */
  async findByUserId(userId: string): Promise<IPortfolio[]> {
    try {
      return await this.prisma.portfolio.findMany({
        where: {
          userId,
          deletedAt: null,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      this.logger.error(`Error finding portfolios for user: ${userId}`, error);
      throw error;
    }
  }

  /**
   * Update portfolio
   * @param portfolioId Portfolio ID
   * @param payload Update payload
   * @returns Updated portfolio
   */
  async update(
    portfolioId: string,
    payload: IUpdatePortfolioPayload,
  ): Promise<IPortfolio> {
    try {
      return await this.prisma.portfolio.update({
        where: { id: portfolioId },
        data: {
          name: payload.name,
          description: payload.description,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      this.logger.error(`Error updating portfolio: ${portfolioId}`, error);
      throw error;
    }
  }

  /**
   * Soft delete portfolio
   * @param portfolioId Portfolio ID
   * @returns void
   */
  async delete(portfolioId: string): Promise<void> {
    try {
      await this.prisma.portfolio.update({
        where: { id: portfolioId },
        data: {
          deletedAt: new Date(),
        },
      });
    } catch (error) {
      this.logger.error(`Error deleting portfolio: ${portfolioId}`, error);
      throw error;
    }
  }

  /**
   * Get portfolio with investments
   * @param portfolioId Portfolio ID
   * @returns Portfolio with investments array
   */
  async findByIdWithInvestments(
    portfolioId: string,
  ): Promise<PortfolioWithInvestments | null> {
    try {
      return await this.prisma.portfolio.findUnique({
        where: { id: portfolioId },
        include: {
          investments: {
            where: { deletedAt: null },
          },
        },
      });
    } catch (error) {
      this.logger.error(
        `Error finding portfolio with investments: ${portfolioId}`,
        error,
      );
      throw error;
    }
  }

  /**
   * Get investments for portfolio
   * @param portfolioId Portfolio ID
   * @returns Array of investments with transactions
   */
  async getInvestments(
    portfolioId: string,
  ): Promise<InvestmentWithTransactions[]> {
    try {
      return await this.prisma.investment.findMany({
        where: {
          portfolioId,
          deletedAt: null,
        },
        include: {
          transactions: true,
        },
      });
    } catch (error) {
      this.logger.error(
        `Error fetching investments for portfolio: ${portfolioId}`,
        error,
      );
      throw error;
    }
  }
}
