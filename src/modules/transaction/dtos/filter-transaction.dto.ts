import { IsOptional, IsEnum, IsDate, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum TransactionTypeFilter {
  BUY = 'BUY',
  SELL = 'SELL',
}

export class FilterTransactionDto {
  @ApiPropertyOptional({
    enum: TransactionTypeFilter,
    description: 'Filter by transaction type',
  })
  @IsEnum(TransactionTypeFilter)
  @IsOptional()
  type?: TransactionTypeFilter;

  @ApiPropertyOptional({
    example: '2024-01-01T00:00:00Z',
    description: 'Filter from date',
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  fromDate?: Date;

  @ApiPropertyOptional({
    example: '2024-12-31T23:59:59Z',
    description: 'Filter to date',
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  toDate?: Date;

  @ApiPropertyOptional({
    example: 1,
    description: 'Page number',
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({
    example: 10,
    description: 'Items per page',
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  limit?: number = 10;
}
