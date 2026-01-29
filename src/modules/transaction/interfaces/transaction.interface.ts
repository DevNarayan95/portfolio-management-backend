// // src/modules/transaction/interfaces/transaction.interface.ts
// export interface ITransaction {
//   id: string;
//   investmentId: string;
//   portfolioId: string;
//   type: string;
//   quantity: number;
//   price: number;
//   amount: number;
//   transactionDate: Date;
//   notes?: string | null;
//   createdAt: Date;
//   updatedAt: Date;
// }

// export interface ICreateTransactionPayload {
//   investmentId: string;
//   portfolioId: string;
//   type: string;
//   quantity: number;
//   price: number;
//   amount: number;
//   transactionDate: Date;
//   notes?: string;
// }

// export interface ITransactionAnalytics {
//   totalTransactions: number;
//   totalBuyTransactions: number;
//   totalSellTransactions: number;
//   totalBuyAmount: number;
//   totalSellAmount: number;
//   totalBuyQuantity: number;
//   totalSellQuantity: number;
//   averageBuyPrice: string;
//   averageSellPrice: string;
// }

// export interface ITransactionPaginated {
//   data: ITransaction[];
//   total: number;
//   page: number;
//   limit: number;
//   totalPages: number;
// }
