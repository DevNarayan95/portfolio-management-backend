// src/modules/portfolio/dtos/portfolio-response.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PortfolioResponseDto {
  @ApiProperty({
    example: 'clnxx123xxx',
    description: 'Portfolio ID',
  })
  id!: string;

  @ApiProperty({
    example: 'My Investment Portfolio',
    description: 'Portfolio name',
  })
  name!: string;

  @ApiPropertyOptional({
    example: 'Long-term investment portfolio',
    description: 'Portfolio description',
  })
  description?: string;

  @ApiPropertyOptional({
    example: 50000,
    description: 'Total portfolio value',
  })
  totalValue?: number;

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
