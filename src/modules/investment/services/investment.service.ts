import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InvestmentRepository } from '../repositories/investment.repository';
import { PortfolioRepository } from '../../portfolio/repositories/portfolio.repository';
import {
  CreateInvestmentDto,
  UpdateInvestmentDto,
  InvestmentResponseDto,
} from '../dtos';
import {
  IInvestment,
  IInvestmentPerformance,
} from '../interfaces/investment.interface';

@Injectable()
export class InvestmentService {
  private readonly logger = new Logger(InvestmentService.name);

  constructor(
    private investmentRepository: InvestmentRepository,
    private portfolioRepository: PortfolioRepository,
  ) {}

  /**
   * Create a new investment
   */
  async createInvestment(
    userId: string,
    portfolioId: string,
    createInvestmentDto: CreateInvestmentDto,
  ): Promise<InvestmentResponseDto> {
    try {
      // Verify portfolio ownership
      const portfolio = await this.portfolioRepository.findById(portfolioId);

      if (!portfolio) {
        throw new NotFoundException('Portfolio not found');
      }

      if (portfolio.userId !== userId) {
        throw new ForbiddenException(
          'You do not have access to this portfolio',
        );
      }

      // Validate SIP fields if isSIP is true
      if (createInvestmentDto.isSIP) {
        if (
          !createInvestmentDto.sipAmount ||
          !createInvestmentDto.sipStartDate ||
          !createInvestmentDto.sipDuration
        ) {
          throw new BadRequestException(
            'sipAmount, sipStartDate, and sipDuration are required for SIP investments',
          );
        }

        if (createInvestmentDto.sipDuration < 1) {
          throw new BadRequestException(
            'SIP duration must be at least 1 month',
          );
        }
      }

      // Validate prices
      if (createInvestmentDto.quantity <= 0) {
        throw new BadRequestException('Quantity must be greater than 0');
      }

      if (createInvestmentDto.purchasePrice < 0) {
        throw new BadRequestException('Purchase price cannot be negative');
      }

      if (createInvestmentDto.currentPrice < 0) {
        throw new BadRequestException('Current price cannot be negative');
      }

      const investment = await this.investmentRepository.create({
        portfolioId,
        type: createInvestmentDto.type,
        name: createInvestmentDto.name,
        symbol: createInvestmentDto.symbol,
        quantity: createInvestmentDto.quantity,
        purchasePrice: createInvestmentDto.purchasePrice,
        currentPrice: createInvestmentDto.currentPrice,
        purchaseDate: createInvestmentDto.purchaseDate,
        notes: createInvestmentDto.notes,
        isSIP: createInvestmentDto.isSIP,
        sipAmount: createInvestmentDto.sipAmount,
        sipStartDate: createInvestmentDto.sipStartDate,
        sipDuration: createInvestmentDto.sipDuration,
      });

      return this.mapToResponseDto(investment);
    } catch (error: unknown) {
      this.logger.error('Error in createInvestment', (error as Error).stack);
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException ||
        error instanceof BadRequestException
      )
        throw error;
      throw new InternalServerErrorException('Failed to create investment');
    }
  }

  /**
   * Get all investments for a portfolio
   */
  async getInvestmentsByPortfolio(
    userId: string,
    portfolioId: string,
  ): Promise<InvestmentResponseDto[]> {
    try {
      // Verify portfolio ownership
      const portfolio = await this.portfolioRepository.findById(portfolioId);

      if (!portfolio) {
        throw new NotFoundException('Portfolio not found');
      }

      if (portfolio.userId !== userId) {
        throw new ForbiddenException(
          'You do not have access to this portfolio',
        );
      }

      const investments =
        await this.investmentRepository.findByPortfolioId(portfolioId);

      return investments.map((inv) => this.mapToResponseDto(inv));
    } catch (error: unknown) {
      this.logger.error(
        'Error in getInvestmentsByPortfolio',
        (error as Error).stack,
      );
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      )
        throw error;
      throw new InternalServerErrorException('Failed to fetch investments');
    }
  }

  /**
   * Get investment by ID with authorization check
   */
  async getInvestmentById(
    userId: string,
    portfolioId: string,
    investmentId: string,
  ): Promise<InvestmentResponseDto> {
    try {
      // Verify portfolio ownership
      const portfolio = await this.portfolioRepository.findById(portfolioId);

      if (!portfolio) {
        throw new NotFoundException('Portfolio not found');
      }

      if (portfolio.userId !== userId) {
        throw new ForbiddenException(
          'You do not have access to this portfolio',
        );
      }

      const investment = await this.investmentRepository.findById(investmentId);

      if (!investment) {
        throw new NotFoundException('Investment not found');
      }

      if (investment.portfolioId !== portfolioId || investment.deletedAt) {
        throw new NotFoundException('Investment not found');
      }

      return this.mapToResponseDto(investment);
    } catch (error: unknown) {
      this.logger.error('Error in getInvestmentById', (error as Error).stack);
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      )
        throw error;
      throw new InternalServerErrorException('Failed to fetch investment');
    }
  }

  /**
   * Update investment
   */
  async updateInvestment(
    userId: string,
    portfolioId: string,
    investmentId: string,
    updateInvestmentDto: UpdateInvestmentDto,
  ): Promise<InvestmentResponseDto> {
    try {
      // Get investment with ownership verification
      await this.getInvestmentById(userId, portfolioId, investmentId);

      // Validate update payload
      if (
        !updateInvestmentDto.name &&
        !updateInvestmentDto.currentPrice &&
        !updateInvestmentDto.notes &&
        !updateInvestmentDto.sipAmount
      ) {
        throw new BadRequestException(
          'At least one field must be provided for update',
        );
      }

      // Validate prices
      if (
        updateInvestmentDto.currentPrice !== undefined &&
        updateInvestmentDto.currentPrice < 0
      ) {
        throw new BadRequestException('Current price cannot be negative');
      }

      if (
        updateInvestmentDto.sipAmount !== undefined &&
        updateInvestmentDto.sipAmount < 0
      ) {
        throw new BadRequestException('SIP amount cannot be negative');
      }

      const updated = await this.investmentRepository.update(investmentId, {
        name: updateInvestmentDto.name,
        currentPrice: updateInvestmentDto.currentPrice,
        notes: updateInvestmentDto.notes,
        sipAmount: updateInvestmentDto.sipAmount,
      });

      return this.mapToResponseDto(updated);
    } catch (error: unknown) {
      this.logger.error('Error in updateInvestment', (error as Error).stack);
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException ||
        error instanceof BadRequestException
      )
        throw error;
      throw new InternalServerErrorException('Failed to update investment');
    }
  }

  /**
   * Delete investment
   */
  async deleteInvestment(
    userId: string,
    portfolioId: string,
    investmentId: string,
  ): Promise<void> {
    try {
      // Get investment with ownership verification
      await this.getInvestmentById(userId, portfolioId, investmentId);

      await this.investmentRepository.delete(investmentId);
    } catch (error: unknown) {
      this.logger.error('Error in deleteInvestment', (error as Error).stack);
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      )
        throw error;
      throw new InternalServerErrorException('Failed to delete investment');
    }
  }

  /**
   * Get investment performance metrics
   */
  async getInvestmentPerformance(
    userId: string,
    portfolioId: string,
    investmentId: string,
  ): Promise<IInvestmentPerformance> {
    try {
      // Get investment with ownership verification
      const investment = await this.getInvestmentById(
        userId,
        portfolioId,
        investmentId,
      );

      // Calculate performance metrics
      const investedAmount = investment.quantity * investment.purchasePrice;
      const currentValue = investment.quantity * investment.currentPrice;
      const gainLoss = currentValue - investedAmount;
      const gainLossPercentage =
        investedAmount > 0
          ? ((gainLoss / investedAmount) * 100).toFixed(2)
          : '0.00';

      // Get transaction history
      const transactions =
        await this.investmentRepository.getTransactions(investmentId);

      return {
        investmentId,
        name: investment.name,
        type: investment.type,
        quantity: investment.quantity,
        purchasePrice: investment.purchasePrice,
        currentPrice: investment.currentPrice,
        investedAmount,
        currentValue,
        gainLoss,
        gainLossPercentage,
        isSIP: investment.isSIP,
        transactionCount: transactions.length,
      };
    } catch (error: unknown) {
      this.logger.error(
        'Error in getInvestmentPerformance',
        (error as Error).stack,
      );
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      )
        throw error;
      throw new InternalServerErrorException(
        'Failed to fetch investment performance',
      );
    }
  }

  /**
   * Map investment entity to response DTO
   */
  private mapToResponseDto(investment: IInvestment): InvestmentResponseDto {
    return {
      id: investment.id,
      portfolioId: investment.portfolioId,
      type: investment.type,
      name: investment.name,
      symbol: investment.symbol,
      quantity: investment.quantity,
      purchasePrice: investment.purchasePrice,
      currentPrice: investment.currentPrice,
      purchaseDate: investment.purchaseDate,
      notes: investment.notes ?? '',
      isSIP: investment.isSIP,
      sipAmount: investment.sipAmount,
      sipStartDate: investment.sipStartDate,
      sipDuration: investment.sipDuration,
      createdAt: investment.createdAt,
      updatedAt: investment.updatedAt,
    };
  }
}
