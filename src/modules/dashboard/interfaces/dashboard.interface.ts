export interface IDashboardSummary {
  userEmail: string;
  totalInvestedAllPortfolios: number;
  totalCurrentValueAllPortfolios: number;
  totalGainLossAllPortfolios: number;
  overallGainLossPercentage: string;
  totalPortfolios: number;
  totalInvestments: number;
  totalTransactions: number;
  globalAssetBreakdown: Record<string, number>;
  globalAssetAllocation: Record<string, string>;
  portfolios: IPortfolioSummary[];
}

export interface IPortfolioSummary {
  portfolioId: string;
  portfolioName: string;
  totalInvested: number;
  totalCurrentValue: number;
  totalGainLoss: number;
  gainLossPercentage: string;
  numberOfInvestments: number;
  assetBreakdown: Record<string, number>;
  assetAllocation: Record<string, string>;
  createdAt: Date;
}

export interface IInvestmentPerformance {
  investmentId: string;
  name: string;
  type: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  totalInvested: number;
  currentValue: number;
  gainLoss: number;
  gainLossPercentage: string;
  isSIP: boolean;
  transactionCount: number;
  firstPurchaseDate: Date;
}

export interface IPortfolioAllocation {
  portfolioId: string;
  allocation: Record<string, { value: number; allocation: string }>;
  totalValue: number;
}

export interface IPortfolioMetrics {
  totalInvested: number;
  totalCurrentValue: number;
  totalGainLoss: number;
  gainLossPercentage: string;
  numberOfInvestments: number;
}
