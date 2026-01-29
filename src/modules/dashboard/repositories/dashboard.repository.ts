// src/modules/dashboard/repositories/dashboard.repository.ts
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { User, Portfolio, Investment } from '@prisma/client';

interface PortfolioWithInvestments extends Portfolio {
  investments: Investment[];
  transactions: any[];
}

interface UserWithPortfolios extends User {
  portfolios: PortfolioWithInvestments[];
}

@Injectable()
export class DashboardRepository {
  private readonly logger = new Logger(DashboardRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get user with all portfolios and investments
   * @param userId User ID
   * @returns User with portfolios
   */
  async getUserWithPortfolios(
    userId: string,
  ): Promise<UserWithPortfolios | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          portfolios: {
            where: { deletedAt: null },
            include: {
              investments: {
                where: { deletedAt: null },
              },
              transactions: true,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error(
        `Error fetching user with portfolios: ${userId}`,
        error,
      );
      throw error;
    }
  }

  /**
   * Get portfolio with investments
   * @param portfolioId Portfolio ID
   * @returns Portfolio with investments
   */
  async getPortfolioWithInvestments(
    portfolioId: string,
  ): Promise<PortfolioWithInvestments | null> {
    try {
      return await this.prisma.portfolio.findUnique({
        where: { id: portfolioId },
        include: {
          investments: {
            where: { deletedAt: null },
          },
          transactions: true,
        },
      });
    } catch (error) {
      this.logger.error(
        `Error fetching portfolio with investments: ${portfolioId}`,
        error,
      );
      throw error;
    }
  }

  /**
   * Get investments for portfolio with transactions
   * @param portfolioId Portfolio ID
   * @returns Array of investments with transactions
   */
  async getInvestmentsWithTransactions(portfolioId: string): Promise<any[]> {
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
        `Error fetching investments with transactions: ${portfolioId}`,
        error,
      );
      throw error;
    }
  }

  /**
   * Get user by ID
   * @param userId User ID
   * @returns User or null
   */
  async getUserById(userId: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { id: userId },
      });
    } catch (error) {
      this.logger.error(`Error fetching user: ${userId}`, error);
      throw error;
    }
  }

  /**
   * Get portfolio by ID
   * @param portfolioId Portfolio ID
   * @returns Portfolio or null
   */
  async getPortfolioById(portfolioId: string): Promise<Portfolio | null> {
    try {
      return await this.prisma.portfolio.findUnique({
        where: { id: portfolioId },
      });
    } catch (error) {
      this.logger.error(`Error fetching portfolio: ${portfolioId}`, error);
      throw error;
    }
  }
}
