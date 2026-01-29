import {
  IsString,
  IsNumber,
  IsOptional,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateInvestmentDto {
  @ApiPropertyOptional({
    example: 'Updated Fund Name',
    description: 'Investment name',
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({
    example: 2800,
    description: 'Current price per unit',
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @Min(0)
  currentPrice?: number;

  @ApiPropertyOptional({
    example: 'Updated notes',
    description: 'Investment notes',
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  notes?: string;

  @ApiPropertyOptional({
    example: 5500,
    description: 'Updated SIP amount',
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @Min(0)
  sipAmount?: number;
}
