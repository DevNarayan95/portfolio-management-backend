import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PortfolioRepository } from '../repositories/portfolio.repository';
import {
  CreatePortfolioDto,
  UpdatePortfolioDto,
  PortfolioResponseDto,
} from '../dtos';
import { IPortfolio, IPortfolioStats } from '../interfaces/portfolio.interface';

@Injectable()
export class PortfolioService {
  private readonly logger = new Logger(PortfolioService.name);

  constructor(private portfolioRepository: PortfolioRepository) {}

  /**
   * Create a new portfolio
   */
  async createPortfolio(
    userId: string,
    createPortfolioDto: CreatePortfolioDto,
  ): Promise<PortfolioResponseDto> {
    try {
      if (!userId) {
        throw new BadRequestException('User ID is required');
      }

      const portfolio = await this.portfolioRepository.create({
        userId,
        name: createPortfolioDto.name,
        description: createPortfolioDto.description,
      });

      return this.mapToResponseDto(portfolio);
    } catch (error: unknown) {
      this.logger.error('Error in createPortfolio', (error as Error).stack);
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Failed to create portfolio');
    }
  }

  /**
   * Get all portfolios for a user
   */
  async getAllPortfolios(userId: string): Promise<PortfolioResponseDto[]> {
    try {
      if (!userId) {
        throw new BadRequestException('User ID is required');
      }

      const portfolios = await this.portfolioRepository.findByUserId(userId);
      return portfolios.map((p) => this.mapToResponseDto(p));
    } catch (error: unknown) {
      this.logger.error('Error in getAllPortfolios', (error as Error).stack);
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Failed to fetch portfolios');
    }
  }

  /**
   * Get portfolio by ID with authorization check
   */
  async getPortfolioById(
    userId: string,
    portfolioId: string,
  ): Promise<PortfolioResponseDto> {
    try {
      if (!userId || !portfolioId) {
        throw new BadRequestException('User ID and Portfolio ID are required');
      }

      const portfolio = await this.portfolioRepository.findById(portfolioId);

      if (!portfolio) {
        throw new NotFoundException('Portfolio not found');
      }

      if (portfolio.deletedAt) {
        throw new NotFoundException('Portfolio not found');
      }

      if (portfolio.userId !== userId) {
        throw new ForbiddenException(
          'You do not have access to this portfolio',
        );
      }

      return this.mapToResponseDto(portfolio);
    } catch (error: unknown) {
      this.logger.error('Error in getPortfolioById', (error as Error).stack);
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      )
        throw error;
      throw new InternalServerErrorException('Failed to fetch portfolio');
    }
  }

  /**
   * Update portfolio
   */
  async updatePortfolio(
    userId: string,
    portfolioId: string,
    updatePortfolioDto: UpdatePortfolioDto,
  ): Promise<PortfolioResponseDto> {
    try {
      // Verify ownership
      await this.getPortfolioById(userId, portfolioId);

      // Validate update payload
      if (!updatePortfolioDto.name && !updatePortfolioDto.description) {
        throw new BadRequestException(
          'At least one field must be provided for update',
        );
      }

      const updatedPortfolio = await this.portfolioRepository.update(
        portfolioId,
        {
          name: updatePortfolioDto.name,
          description: updatePortfolioDto.description,
        },
      );

      return this.mapToResponseDto(updatedPortfolio);
    } catch (error: unknown) {
      this.logger.error('Error in updatePortfolio', (error as Error).stack);
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Failed to update portfolio');
    }
  }

  /**
   * Delete portfolio
   */
  async deletePortfolio(userId: string, portfolioId: string): Promise<void> {
    try {
      // Verify ownership
      await this.getPortfolioById(userId, portfolioId);

      await this.portfolioRepository.delete(portfolioId);
    } catch (error: unknown) {
      this.logger.error('Error in deletePortfolio', (error as Error).stack);
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      )
        throw error;
      throw new InternalServerErrorException('Failed to delete portfolio');
    }
  }

  /**
   * Get portfolio statistics
   */
  async getPortfolioStats(
    userId: string,
    portfolioId: string,
  ): Promise<IPortfolioStats> {
    try {
      // Verify ownership
      await this.getPortfolioById(userId, portfolioId);

      const investments =
        await this.portfolioRepository.getInvestments(portfolioId);

      let totalInvested = 0;
      let totalCurrentValue = 0;
      const assetBreakdown: Record<string, number> = {};

      investments.forEach((inv) => {
        const investmentValue = inv.quantity * inv.purchasePrice;
        const currentValue = inv.quantity * inv.currentPrice;

        totalInvested += investmentValue;
        totalCurrentValue += currentValue;

        if (!assetBreakdown[inv.type]) {
          assetBreakdown[inv.type] = 0;
        }
        assetBreakdown[inv.type] += currentValue;
      });

      const totalGainLoss = totalCurrentValue - totalInvested;
      const gainLossPercentage =
        totalInvested > 0
          ? ((totalGainLoss / totalInvested) * 100).toFixed(2)
          : '0.00';

      return {
        portfolioId,
        totalInvested,
        totalCurrentValue,
        totalGainLoss,
        gainLossPercentage,
        assetBreakdown,
        numberOfInvestments: investments.length,
      };
    } catch (error: unknown) {
      this.logger.error('Error in getPortfolioStats', (error as Error).stack);
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      )
        throw error;
      throw new InternalServerErrorException('Failed to fetch portfolio stats');
    }
  }

  /**
   * Map portfolio entity to response DTO
   */
  private mapToResponseDto(portfolio: IPortfolio): PortfolioResponseDto {
    return {
      id: portfolio.id,
      name: portfolio.name,
      description: portfolio.description ?? '',
      createdAt: portfolio.createdAt,
      updatedAt: portfolio.updatedAt,
    };
  }
}
