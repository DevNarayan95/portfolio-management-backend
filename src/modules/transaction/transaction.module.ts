// // src/modules/transaction/transaction.module.ts
// import { Module } from '@nestjs/common';
// import { PrismaModule } from '../../prisma/prisma.module';
// import { PortfolioModule } from '../portfolio/portfolio.module';
// import { InvestmentModule } from '../investment/investment.module';
// import { TransactionController } from './controllers/transaction.controller';
// import { TransactionService } from './services/transaction.service';
// import { TransactionRepository } from './repositories/transaction.repository';

// @Module({
//   imports: [PrismaModule, PortfolioModule, InvestmentModule],
//   controllers: [TransactionController],
//   providers: [TransactionService, TransactionRepository],
//   exports: [TransactionService, TransactionRepository],
// })
// export class TransactionModule {}
