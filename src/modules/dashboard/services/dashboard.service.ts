// // src/modules/dashboard/services/dashboard.service.ts
// import {
//   Injectable,
//   NotFoundException,
//   ForbiddenException,
//   Logger,
// } from '@nestjs/common';
// import { Investment } from '@prisma/client';
// import { DashboardRepository } from '../repositories/dashboard.repository';
// import {
//   IDashboardSummary,
//   IPortfolioSummary,
//   IInvestmentPerformance,
//   IPortfolioAllocation,
//   IPortfolioMetrics,
// } from '../interfaces/dashboard.interface';

// interface InvestmentWithTransactions extends Investment {
//   transactions: any[];
// }

// @Injectable()
// export class DashboardService {
//   private readonly logger = new Logger(DashboardService.name);

//   constructor(private dashboardRepository: DashboardRepository) {}

//   /**
//    * Get dashboard summary for user
//    */
//   async getDashboardSummary(userId: string): Promise<IDashboardSummary> {
//     const user = await this.dashboardRepository.getUserWithPortfolios(userId);

//     if (!user) {
//       throw new NotFoundException('User not found');
//     }

//     let totalInvestedAllPortfolios = 0;
//     let totalCurrentValueAllPortfolios = 0;
//     let totalInvestmentCount = 0;
//     let totalTransactionCount = 0;
//     const globalAssetBreakdown: Record<string, number> = {
//       MUTUAL_FUND: 0,
//       STOCK: 0,
//       BOND: 0,
//       CRYPTOCURRENCY: 0,
//     };

//     const portfolioSummaries: IPortfolioSummary[] = [];

//     for (const portfolio of user.portfolios) {
//       const { metrics, assetBreakdown } = this.calculatePortfolioMetrics(
//         portfolio.investments,
//       );

//       totalInvestedAllPortfolios += metrics.totalInvested;
//       totalCurrentValueAllPortfolios += metrics.totalCurrentValue;
//       totalInvestmentCount += portfolio.investments.length;
//       totalTransactionCount += portfolio.transactions.length;

//       Object.keys(assetBreakdown).forEach((key) => {
//         globalAssetBreakdown[key] += assetBreakdown[key];
//       });

//       portfolioSummaries.push({
//         portfolioId: portfolio.id,
//         portfolioName: portfolio.name,
//         ...metrics,
//         assetBreakdown,
//         assetAllocation: this.calculateAssetAllocation(
//           assetBreakdown,
//           metrics.totalCurrentValue,
//         ),
//         createdAt: portfolio.createdAt,
//       });
//     }

//     const totalGainLossAllPortfolios =
//       totalCurrentValueAllPortfolios - totalInvestedAllPortfolios;
//     const overallGainLossPercentage =
//       totalInvestedAllPortfolios > 0
//         ? (
//             (totalGainLossAllPortfolios / totalInvestedAllPortfolios) *
//             100
//           ).toFixed(2)
//         : '0.00';

//     return {
//       userEmail: user.email,
//       totalInvestedAllPortfolios,
//       totalCurrentValueAllPortfolios,
//       totalGainLossAllPortfolios,
//       overallGainLossPercentage,
//       totalPortfolios: user.portfolios.length,
//       totalInvestments: totalInvestmentCount,
//       totalTransactions: totalTransactionCount,
//       globalAssetBreakdown,
//       globalAssetAllocation: this.calculateAssetAllocation(
//         globalAssetBreakdown,
//         totalCurrentValueAllPortfolios,
//       ),
//       portfolios: portfolioSummaries,
//     };
//   }

//   /**
//    * Get portfolio summary
//    */
//   async getPortfolioSummary(
//     userId: string,
//     portfolioId: string,
//   ): Promise<IPortfolioSummary> {
//     const portfolio =
//       await this.dashboardRepository.getPortfolioWithInvestments(portfolioId);

//     if (!portfolio) {
//       throw new NotFoundException('Portfolio not found');
//     }

//     if (portfolio.userId !== userId) {
//       throw new ForbiddenException('You do not have access to this portfolio');
//     }

//     const { metrics, assetBreakdown } = this.calculatePortfolioMetrics(
//       portfolio.investments,
//     );

//     return {
//       portfolioId: portfolio.id,
//       portfolioName: portfolio.name,
//       ...metrics,
//       assetBreakdown,
//       assetAllocation: this.calculateAssetAllocation(
//         assetBreakdown,
//         metrics.totalCurrentValue,
//       ),
//       createdAt: portfolio.createdAt,
//     };
//   }

//   /**
//    * Get investment performances for portfolio
//    */
//   async getInvestmentPerformances(
//     userId: string,
//     portfolioId: string,
//   ): Promise<IInvestmentPerformance[]> {
//     const portfolio =
//       await this.dashboardRepository.getPortfolioById(portfolioId);

//     if (!portfolio) {
//       throw new NotFoundException('Portfolio not found');
//     }

//     if (portfolio.userId !== userId) {
//       throw new ForbiddenException('You do not have access to this portfolio');
//     }

//     const investments =
//       await this.dashboardRepository.getInvestmentsWithTransactions(
//         portfolioId,
//       );

//     return investments.map((inv) => this.mapToPerformanceDto(inv));
//   }

//   /**
//    * Get portfolio allocation
//    */
//   async getPortfolioAllocation(
//     userId: string,
//     portfolioId: string,
//   ): Promise<IPortfolioAllocation> {
//     const portfolio =
//       await this.dashboardRepository.getPortfolioWithInvestments(portfolioId);

//     if (!portfolio) {
//       throw new NotFoundException('Portfolio not found');
//     }

//     if (portfolio.userId !== userId) {
//       throw new ForbiddenException('You do not have access to this portfolio');
//     }

//     const allocation: Record<string, { value: number; allocation: string }> = {
//       MUTUAL_FUND: { value: 0, allocation: '0%' },
//       STOCK: { value: 0, allocation: '0%' },
//       BOND: { value: 0, allocation: '0%' },
//       CRYPTOCURRENCY: { value: 0, allocation: '0%' },
//     };

//     let totalValue = 0;

//     portfolio.investments.forEach((inv) => {
//       const value = inv.quantity * inv.currentPrice;
//       allocation[inv.type].value += value;
//       totalValue += value;
//     });

//     Object.keys(allocation).forEach((key) => {
//       const percentage =
//         totalValue > 0
//           ? ((allocation[key].value / totalValue) * 100).toFixed(2)
//           : '0.00';
//       allocation[key].allocation = `${percentage}%`;
//     });

//     return {
//       portfolioId,
//       allocation,
//       totalValue,
//     };
//   }

//   /**
//    * Get top performing investments
//    */
//   async getTopPerformers(
//     userId: string,
//     portfolioId: string,
//     limit: number = 5,
//   ): Promise<IInvestmentPerformance[]> {
//     const performances = await this.getInvestmentPerformances(
//       userId,
//       portfolioId,
//     );

//     return performances
//       .sort(
//         (a, b) =>
//           parseFloat(b.gainLossPercentage) - parseFloat(a.gainLossPercentage),
//       )
//       .slice(0, limit);
//   }

//   /**
//    * Get bottom performing investments
//    */
//   async getBottomPerformers(
//     userId: string,
//     portfolioId: string,
//     limit: number = 5,
//   ): Promise<IInvestmentPerformance[]> {
//     const performances = await this.getInvestmentPerformances(
//       userId,
//       portfolioId,
//     );

//     return performances
//       .sort(
//         (a, b) =>
//           parseFloat(a.gainLossPercentage) - parseFloat(b.gainLossPercentage),
//       )
//       .slice(0, limit);
//   }

//   /**
//    * Calculate portfolio metrics
//    * @param investments Array of investments
//    * @returns Calculated metrics and asset breakdown
//    */
//   private calculatePortfolioMetrics(investments: Investment[]): {
//     metrics: IPortfolioMetrics;
//     assetBreakdown: Record<string, number>;
//   } {
//     let totalInvested = 0;
//     let totalCurrentValue = 0;
//     const assetBreakdown: Record<string, number> = {
//       MUTUAL_FUND: 0,
//       STOCK: 0,
//       BOND: 0,
//       CRYPTOCURRENCY: 0,
//     };

//     investments.forEach((inv) => {
//       const investmentValue = inv.quantity * inv.purchasePrice;
//       const currentValue = inv.quantity * inv.currentPrice;

//       totalInvested += investmentValue;
//       totalCurrentValue += currentValue;
//       assetBreakdown[inv.type] += currentValue;
//     });

//     const totalGainLoss = totalCurrentValue - totalInvested;
//     const gainLossPercentage =
//       totalInvested > 0
//         ? ((totalGainLoss / totalInvested) * 100).toFixed(2)
//         : '0.00';

//     return {
//       metrics: {
//         totalInvested,
//         totalCurrentValue,
//         totalGainLoss,
//         gainLossPercentage,
//         numberOfInvestments: investments.length,
//       },
//       assetBreakdown,
//     };
//   }

//   /**
//    * Calculate asset allocation percentages
//    * @param assetBreakdown Asset breakdown by type
//    * @param totalValue Total portfolio value
//    * @returns Asset allocation percentages
//    */
//   private calculateAssetAllocation(
//     assetBreakdown: Record<string, number>,
//     totalValue: number,
//   ): Record<string, string> {
//     const allocation: Record<string, string> = {};

//     Object.keys(assetBreakdown).forEach((key) => {
//       const percentage =
//         totalValue > 0
//           ? ((assetBreakdown[key] / totalValue) * 100).toFixed(2)
//           : '0.00';
//       allocation[key] = `${percentage}%`;
//     });

//     return allocation;
//   }

//   /**
//    * Map investment to performance DTO
//    * @param investment Investment with transactions
//    * @returns Investment performance data
//    */
//   private mapToPerformanceDto(
//     investment: InvestmentWithTransactions,
//   ): IInvestmentPerformance {
//     const totalInvested = investment.quantity * investment.purchasePrice;
//     const currentValue = investment.quantity * investment.currentPrice;
//     const gainLoss = currentValue - totalInvested;
//     const gainLossPercentage =
//       totalInvested > 0
//         ? ((gainLoss / totalInvested) * 100).toFixed(2)
//         : '0.00';

//     return {
//       investmentId: investment.id,
//       name: investment.name,
//       type: investment.type,
//       quantity: investment.quantity,
//       purchasePrice: investment.purchasePrice,
//       currentPrice: investment.currentPrice,
//       totalInvested,
//       currentValue,
//       gainLoss,
//       gainLossPercentage,
//       isSIP: investment.isSIP,
//       transactionCount: investment.transactions.length,
//       firstPurchaseDate: investment.purchaseDate,
//     };
//   }
// }
