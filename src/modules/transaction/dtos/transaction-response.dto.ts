import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TransactionResponseDto {
  @ApiProperty({
    example: 'clnxx123xxx',
    description: 'Transaction ID',
  })
  id!: string;

  @ApiProperty({
    example: 'clnxx123yyy',
    description: 'Investment ID',
  })
  investmentId!: string;

  @ApiProperty({
    example: 'clnxx123zzz',
    description: 'Portfolio ID',
  })
  portfolioId!: string;

  @ApiProperty({
    example: 'BUY',
    description: 'Transaction type',
  })
  type!: string;

  @ApiProperty({
    example: 10,
    description: 'Quantity of units/shares',
  })
  quantity!: number;

  @ApiProperty({
    example: 2500,
    description: 'Price per unit',
  })
  price!: number;

  @ApiProperty({
    example: 25000,
    description: 'Total transaction amount',
  })
  amount!: number;

  @ApiProperty({
    example: '2024-01-15T10:00:00Z',
    description: 'Transaction date',
  })
  transactionDate!: Date;

  @ApiPropertyOptional({
    example: 'Bought at support level',
    description: 'Transaction notes',
  })
  notes?: string | null;

  @ApiProperty({
    example: '2026-01-29T10:00:00Z',
    description: 'Creation timestamp',
  })
  createdAt!: Date;

  @ApiProperty({
    example: '2026-01-29T10:00:00Z',
    description: 'Last update timestamp',
  })
  updatedAt!: Date;
}
