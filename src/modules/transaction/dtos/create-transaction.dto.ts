import {
  IsString,
  IsNumber,
  IsEnum,
  IsDate,
  IsOptional,
  Min,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum TransactionTypeEnum {
  BUY = 'BUY',
  SELL = 'SELL',
}

export class CreateTransactionDto {
  @ApiProperty({
    enum: TransactionTypeEnum,
    description: 'Transaction type (BUY or SELL)',
    example: 'BUY',
  })
  @IsEnum(TransactionTypeEnum)
  type!: TransactionTypeEnum;

  @ApiProperty({
    example: 10,
    description: 'Quantity of units/shares',
  })
  @IsNumber()
  @Min(0.001)
  quantity!: number;

  @ApiProperty({
    example: 2500,
    description: 'Price per unit at transaction time',
  })
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiProperty({
    example: 25000,
    description: 'Total transaction amount (quantity * price)',
  })
  @IsNumber()
  @Min(0)
  amount!: number;

  @ApiProperty({
    example: '2024-01-15T10:00:00Z',
    description: 'Transaction date and time',
  })
  @Type(() => Date)
  @IsDate()
  transactionDate!: Date;

  @ApiPropertyOptional({
    example: 'Bought at support level',
    description: 'Transaction notes',
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  notes?: string;
}
