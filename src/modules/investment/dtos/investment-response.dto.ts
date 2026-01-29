// // src/modules/investment/dtos/investment-response.dto.ts
// import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// import { InvestmentTypeEnum } from './create-investment.dto';

// export class InvestmentResponseDto {
//   @ApiProperty({
//     example: 'clnxx123xxx',
//     description: 'Investment ID',
//   })
//   id!: string;

//   @ApiProperty({
//     example: 'clnxx123yyy',
//     description: 'Portfolio ID',
//   })
//   portfolioId!: string;

//   @ApiProperty({
//     enum: InvestmentTypeEnum,
//     description: 'Investment type',
//     example: InvestmentTypeEnum.MUTUAL_FUND,
//   })
//   type!: string;

//   @ApiProperty({
//     example: 'Axis Bluechip Fund',
//     description: 'Investment name',
//   })
//   name!: string;

//   @ApiPropertyOptional({
//     example: 'AXISBLUECHI',
//     description: 'Stock/Fund symbol',
//     nullable: true,
//   })
//   symbol?: string | null;

//   @ApiProperty({
//     example: 10,
//     description: 'Quantity of units/shares',
//   })
//   quantity!: number;

//   @ApiProperty({
//     example: 2500,
//     description: 'Purchase price per unit',
//   })
//   purchasePrice!: number;

//   @ApiProperty({
//     example: 2750,
//     description: 'Current price per unit',
//   })
//   currentPrice!: number;

//   @ApiProperty({
//     example: '2024-01-15T00:00:00Z',
//     description: 'Purchase date',
//   })
//   purchaseDate!: Date;

//   @ApiPropertyOptional({
//     example: 'Good long-term investment',
//     description: 'Investment notes',
//     nullable: true,
//   })
//   notes?: string | null;

//   @ApiProperty({
//     example: false,
//     description: 'Is SIP investment',
//   })
//   isSIP!: boolean;

//   @ApiPropertyOptional({
//     example: 5000,
//     description: 'Monthly SIP amount',
//     nullable: true,
//   })
//   sipAmount?: number | null;

//   @ApiPropertyOptional({
//     example: '2024-01-15T00:00:00Z',
//     description: 'SIP start date',
//     nullable: true,
//   })
//   sipStartDate?: Date | null;

//   @ApiPropertyOptional({
//     example: 60,
//     description: 'SIP duration in months',
//     nullable: true,
//   })
//   sipDuration?: number | null;

//   @ApiProperty({
//     example: '2026-01-29T10:00:00Z',
//     description: 'Creation timestamp',
//   })
//   createdAt!: Date;

//   @ApiProperty({
//     example: '2026-01-29T10:00:00Z',
//     description: 'Last update timestamp',
//   })
//   updatedAt!: Date;
// }
