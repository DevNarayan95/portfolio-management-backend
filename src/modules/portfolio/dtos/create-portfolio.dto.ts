import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePortfolioDto {
  @ApiProperty({
    example: 'My Investment Portfolio',
    description: 'Portfolio name',
  })
  @IsString()
  @MaxLength(100)
  name!: string;

  @ApiPropertyOptional({
    example: 'Long-term investment portfolio',
    description: 'Portfolio description',
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;
}
