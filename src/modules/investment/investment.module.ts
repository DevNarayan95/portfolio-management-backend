// // src/modules/investment/investment.module.ts
// import { Module } from '@nestjs/common';
// import { PrismaModule } from '../../prisma/prisma.module';
// import { PortfolioModule } from '../portfolio/portfolio.module';
// import { InvestmentController } from './controllers/investment.controller';
// import { InvestmentService } from './services/investment.service';
// import { InvestmentRepository } from './repositories/investment.repository';

// @Module({
//   imports: [PrismaModule, PortfolioModule],
//   controllers: [InvestmentController],
//   providers: [InvestmentService, InvestmentRepository],
//   exports: [InvestmentService, InvestmentRepository],
// })
// export class InvestmentModule {}
