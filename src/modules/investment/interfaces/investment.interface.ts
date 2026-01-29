export interface IInvestment {
  id: string;
  portfolioId: string;
  type: string;
  name: string;
  symbol: string | null;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  purchaseDate: Date;
  notes: string | null;
  isSIP: boolean;
  sipAmount: number | null;
  sipStartDate: Date | null;
  sipDuration: number | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface ICreateInvestmentPayload {
  portfolioId: string;
  type: string;
  name: string;
  symbol?: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  purchaseDate: Date;
  notes?: string;
  isSIP?: boolean;
  sipAmount?: number;
  sipStartDate?: Date;
  sipDuration?: number;
}

export interface IUpdateInvestmentPayload {
  name?: string;
  currentPrice?: number;
  notes?: string;
  sipAmount?: number;
}

export interface IInvestmentPerformance {
  investmentId: string;
  name: string;
  type: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  investedAmount: number;
  currentValue: number;
  gainLoss: number;
  gainLossPercentage: string;
  isSIP: boolean;
  transactionCount: number;
}
