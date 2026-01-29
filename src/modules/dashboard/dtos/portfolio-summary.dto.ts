// src/modules/dashboard/dtos/portfolio-allocation.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class PortfolioSummaryDto {
  @ApiProperty({
    example: 'clnxx123xxx',
    description: 'Portfolio ID',
  })
  portfolioId!: string;

  @ApiProperty({
    example: 'My Investment Portfolio',
    description: 'Portfolio name',
  })
  portfolioName!: string;

  @ApiProperty({
    example: 100000,
    description: 'Total amount invested',
  })
  totalInvested!: number;

  @ApiProperty({
    example: 125000,
    description: 'Current total value',
  })
  totalCurrentValue!: number;

  @ApiProperty({
    example: 25000,
    description: 'Total gain/loss amount',
  })
  totalGainLoss!: number;

  @ApiProperty({
    example: '25.00',
    description: 'Total gain/loss percentage',
  })
  gainLossPercentage!: string;

  @ApiProperty({
    example: 5,
    description: 'Number of investments',
  })
  numberOfInvestments!: number;

  @ApiProperty({
    example: {
      MUTUAL_FUND: 50000,
      STOCK: 40000,
      BOND: 20000,
      CRYPTOCURRENCY: 15000,
    },
    description: 'Asset breakdown by type',
    type: 'object',
    additionalProperties: { type: 'number' },
  })
  assetBreakdown!: Record<string, number>;

  @ApiProperty({
    example: {
      MUTUAL_FUND: '40%',
      STOCK: '32%',
      BOND: '16%',
      CRYPTOCURRENCY: '12%',
    },
    description: 'Asset allocation percentage',
    type: 'object',
    additionalProperties: { type: 'string' },
  })
  assetAllocation!: Record<string, string>;

  @ApiProperty({
    example: '2024-01-15T00:00:00Z',
    description: 'Portfolio creation date',
    type: 'string',
    format: 'date-time',
  })
  createdAt!: Date;
}
