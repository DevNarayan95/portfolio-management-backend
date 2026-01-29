// // src/modules/portfolio/services/portfolio.service.ts
// import {
//   Injectable,
//   NotFoundException,
//   ForbiddenException,
//   BadRequestException,
// } from '@nestjs/common';
// import { PortfolioRepository } from '../repositories/portfolio.repository';
// import {
//   CreatePortfolioDto,
//   UpdatePortfolioDto,
//   PortfolioResponseDto,
// } from '../dtos';
// import { IPortfolio, IPortfolioStats } from '../interfaces/portfolio.interface';

// @Injectable()
// export class PortfolioService {
//   constructor(private portfolioRepository: PortfolioRepository) {}

//   /**
//    * Create a new portfolio
//    */
//   async createPortfolio(
//     userId: string,
//     createPortfolioDto: CreatePortfolioDto,
//   ): Promise<PortfolioResponseDto> {
//     if (!userId) {
//       throw new BadRequestException('User ID is required');
//     }

//     const portfolio = await this.portfolioRepository.create({
//       userId,
//       name: createPortfolioDto.name,
//       description: createPortfolioDto.description,
//     });

//     return this.mapToResponseDto(portfolio);
//   }

//   /**
//    * Get all portfolios for a user
//    */
//   async getAllPortfolios(userId: string): Promise<PortfolioResponseDto[]> {
//     if (!userId) {
//       throw new BadRequestException('User ID is required');
//     }

//     const portfolios = await this.portfolioRepository.findByUserId(userId);
//     return portfolios.map((p) => this.mapToResponseDto(p));
//   }

//   /**
//    * Get portfolio by ID with authorization check
//    */
//   async getPortfolioById(
//     userId: string,
//     portfolioId: string,
//   ): Promise<PortfolioResponseDto> {
//     if (!userId || !portfolioId) {
//       throw new BadRequestException('User ID and Portfolio ID are required');
//     }

//     const portfolio = await this.portfolioRepository.findById(portfolioId);

//     if (!portfolio) {
//       throw new NotFoundException('Portfolio not found');
//     }

//     if (portfolio.deletedAt) {
//       throw new NotFoundException('Portfolio not found');
//     }

//     if (portfolio.userId !== userId) {
//       throw new ForbiddenException('You do not have access to this portfolio');
//     }

//     return this.mapToResponseDto(portfolio);
//   }

//   /**
//    * Update portfolio
//    */
//   async updatePortfolio(
//     userId: string,
//     portfolioId: string,
//     updatePortfolioDto: UpdatePortfolioDto,
//   ): Promise<PortfolioResponseDto> {
//     // Verify ownership
//     await this.getPortfolioById(userId, portfolioId);

//     // Validate update payload
//     if (!updatePortfolioDto.name && !updatePortfolioDto.description) {
//       throw new BadRequestException(
//         'At least one field must be provided for update',
//       );
//     }

//     const updatedPortfolio = await this.portfolioRepository.update(
//       portfolioId,
//       {
//         name: updatePortfolioDto.name,
//         description: updatePortfolioDto.description,
//       },
//     );

//     return this.mapToResponseDto(updatedPortfolio);
//   }

//   /**
//    * Delete portfolio
//    */
//   async deletePortfolio(userId: string, portfolioId: string): Promise<void> {
//     // Verify ownership
//     await this.getPortfolioById(userId, portfolioId);

//     await this.portfolioRepository.delete(portfolioId);
//   }

//   /**
//    * Get portfolio statistics
//    */
//   async getPortfolioStats(
//     userId: string,
//     portfolioId: string,
//   ): Promise<IPortfolioStats> {
//     // Verify ownership
//     await this.getPortfolioById(userId, portfolioId);

//     const investments =
//       await this.portfolioRepository.getInvestments(portfolioId);

//     let totalInvested = 0;
//     let totalCurrentValue = 0;
//     const assetBreakdown: Record<string, number> = {};

//     investments.forEach((inv) => {
//       const investmentValue = inv.quantity * inv.purchasePrice;
//       const currentValue = inv.quantity * inv.currentPrice;

//       totalInvested += investmentValue;
//       totalCurrentValue += currentValue;

//       if (!assetBreakdown[inv.type]) {
//         assetBreakdown[inv.type] = 0;
//       }
//       assetBreakdown[inv.type] += currentValue;
//     });

//     const totalGainLoss = totalCurrentValue - totalInvested;
//     const gainLossPercentage =
//       totalInvested > 0
//         ? ((totalGainLoss / totalInvested) * 100).toFixed(2)
//         : '0.00';

//     return {
//       portfolioId,
//       totalInvested,
//       totalCurrentValue,
//       totalGainLoss,
//       gainLossPercentage,
//       assetBreakdown,
//       numberOfInvestments: investments.length,
//     };
//   }

//   /**
//    * Map portfolio entity to response DTO
//    */
//   private mapToResponseDto(portfolio: IPortfolio): PortfolioResponseDto {
//     return {
//       id: portfolio.id,
//       name: portfolio.name,
//       description: portfolio.description ?? '',
//       createdAt: portfolio.createdAt,
//       updatedAt: portfolio.updatedAt,
//     };
//   }
// }
