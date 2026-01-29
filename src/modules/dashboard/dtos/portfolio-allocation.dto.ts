// src/modules/dashboard/dtos/portfolio-allocation.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class PortfolioAllocationDto {
  @ApiProperty({
    example: 'clnxx123xxx',
    description: 'Portfolio ID',
  })
  portfolioId!: string;

  @ApiProperty({
    example: {
      MUTUAL_FUND: { value: 50000, allocation: '40%' },
      STOCK: { value: 40000, allocation: '32%' },
      BOND: { value: 20000, allocation: '16%' },
      CRYPTOCURRENCY: { value: 15000, allocation: '12%' },
    },
    description: 'Detailed asset allocation',
    type: 'object',
    additionalProperties: {
      type: 'object',
      properties: {
        value: { type: 'number', example: 50000 },
        allocation: { type: 'string', example: '40%' },
      },
    },
  })
  allocation!: Record<string, { value: number; allocation: string }>;

  @ApiProperty({
    example: 125000,
    description: 'Total portfolio value',
  })
  totalValue!: number;
}
