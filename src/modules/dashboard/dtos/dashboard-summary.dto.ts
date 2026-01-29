import { ApiProperty } from '@nestjs/swagger';
import { PortfolioSummaryDto } from './portfolio-summary.dto';

export class DashboardSummaryDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email',
  })
  userEmail!: string;

  @ApiProperty({
    example: 500000,
    description: 'Total invested across all portfolios',
  })
  totalInvestedAllPortfolios!: number;

  @ApiProperty({
    example: 625000,
    description: 'Total current value across all portfolios',
  })
  totalCurrentValueAllPortfolios!: number;

  @ApiProperty({
    example: 125000,
    description: 'Total gain/loss across all portfolios',
  })
  totalGainLossAllPortfolios!: number;

  @ApiProperty({
    example: '25.00',
    description: 'Overall gain/loss percentage',
  })
  overallGainLossPercentage!: string;

  @ApiProperty({
    example: 3,
    description: 'Total number of portfolios',
  })
  totalPortfolios!: number;

  @ApiProperty({
    example: 15,
    description: 'Total number of investments',
  })
  totalInvestments!: number;

  @ApiProperty({
    example: 250,
    description: 'Total number of transactions',
  })
  totalTransactions!: number;

  @ApiProperty({
    example: {
      MUTUAL_FUND: 250000,
      STOCK: 200000,
      BOND: 100000,
      CRYPTOCURRENCY: 75000,
    },
    description: 'Asset breakdown across all portfolios',
    type: 'object',
    additionalProperties: { type: 'number' },
  })
  globalAssetBreakdown!: Record<string, number>;

  @ApiProperty({
    example: {
      MUTUAL_FUND: '40%',
      STOCK: '32%',
      BOND: '16%',
      CRYPTOCURRENCY: '12%',
    },
    description: 'Global asset allocation percentage',
    type: 'object',
    additionalProperties: { type: 'string' },
  })
  globalAssetAllocation!: Record<string, string>;

  @ApiProperty({
    type: [PortfolioSummaryDto],
    description: 'Individual portfolio summaries',
  })
  portfolios!: PortfolioSummaryDto[];
}
