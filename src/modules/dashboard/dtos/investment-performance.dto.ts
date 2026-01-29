// src/modules/dashboard/dtos/investment-performance.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class InvestmentPerformanceDto {
  @ApiProperty({
    example: 'clnxx123xxx',
    description: 'Investment ID',
  })
  investmentId!: string;

  @ApiProperty({
    example: 'Axis Bluechip Fund',
    description: 'Investment name',
  })
  name!: string;

  @ApiProperty({
    example: 'MUTUAL_FUND',
    description: 'Investment type',
  })
  type!: string;

  @ApiProperty({
    example: 10,
    description: 'Current quantity',
  })
  quantity!: number;

  @ApiProperty({
    example: 2500,
    description: 'Purchase price',
  })
  purchasePrice!: number;

  @ApiProperty({
    example: 2750,
    description: 'Current price',
  })
  currentPrice!: number;

  @ApiProperty({
    example: 25000,
    description: 'Total invested',
  })
  totalInvested!: number;

  @ApiProperty({
    example: 27500,
    description: 'Current value',
  })
  currentValue!: number;

  @ApiProperty({
    example: 2500,
    description: 'Gain/loss amount',
  })
  gainLoss!: number;

  @ApiProperty({
    example: '10.00',
    description: 'Gain/loss percentage',
  })
  gainLossPercentage!: string;

  @ApiProperty({
    example: false,
    description: 'Is SIP investment',
  })
  isSIP!: boolean;

  @ApiProperty({
    example: 10,
    description: 'Number of transactions',
  })
  transactionCount!: number;

  @ApiProperty({
    example: '2024-01-15T00:00:00Z',
    description: 'First purchase date',
    type: 'string',
    format: 'date-time',
  })
  firstPurchaseDate!: Date;
}
