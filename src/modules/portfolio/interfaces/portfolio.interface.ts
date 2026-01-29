export interface IPortfolio {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface IPortfolioStats {
  portfolioId: string;
  totalInvested: number;
  totalCurrentValue: number;
  totalGainLoss: number;
  gainLossPercentage: string;
  assetBreakdown: Record<string, number>;
  numberOfInvestments: number;
}

export interface ICreatePortfolioPayload {
  userId: string;
  name: string;
  description?: string;
}

export interface IUpdatePortfolioPayload {
  name?: string;
  description?: string;
}
