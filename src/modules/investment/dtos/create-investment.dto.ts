// // src/modules/investment/dtos/create-investment.dto.ts
// import {
//   IsString,
//   IsNumber,
//   IsOptional,
//   IsEnum,
//   IsBoolean,
//   IsDate,
//   Min,
//   MaxLength,
// } from 'class-validator';
// import { Type } from 'class-transformer';
// import { ApiProperty } from '@nestjs/swagger';

// export enum InvestmentTypeEnum {
//   MUTUAL_FUND = 'MUTUAL_FUND',
//   STOCK = 'STOCK',
//   BOND = 'BOND',
//   CRYPTOCURRENCY = 'CRYPTOCURRENCY',
// }

// export class CreateInvestmentDto {
//   @ApiProperty({
//     enum: InvestmentTypeEnum,
//     description: 'Type of investment',
//     example: InvestmentTypeEnum.MUTUAL_FUND,
//   })
//   @IsEnum(InvestmentTypeEnum)
//   type!: InvestmentTypeEnum;

//   @ApiProperty({
//     example: 'Axis Bluechip Fund',
//     description: 'Investment name',
//   })
//   @IsString()
//   @MaxLength(100)
//   name!: string;

//   @ApiProperty({
//     example: 'AXISBLUECHI',
//     description: 'Stock/Fund symbol',
//     required: false,
//   })
//   @IsString()
//   @IsOptional()
//   @MaxLength(50)
//   symbol?: string;

//   @ApiProperty({
//     example: 10,
//     description: 'Quantity of units/shares',
//   })
//   @IsNumber()
//   @Min(0.001)
//   quantity!: number;

//   @ApiProperty({
//     example: 2500,
//     description: 'Purchase price per unit',
//   })
//   @IsNumber()
//   @Min(0)
//   purchasePrice!: number;

//   @ApiProperty({
//     example: 2750,
//     description: 'Current price per unit',
//   })
//   @IsNumber()
//   @Min(0)
//   currentPrice!: number;

//   @ApiProperty({
//     example: '2024-01-15T00:00:00Z',
//     description: 'Purchase date',
//   })
//   @Type(() => Date)
//   @IsDate()
//   purchaseDate!: Date;

//   @ApiProperty({
//     example: 'Good long-term investment',
//     description: 'Investment notes',
//     required: false,
//   })
//   @IsString()
//   @IsOptional()
//   @MaxLength(500)
//   notes?: string;

//   @ApiProperty({
//     example: false,
//     description: 'Is this a SIP (Systematic Investment Plan)',
//     required: false,
//   })
//   @IsBoolean()
//   @IsOptional()
//   isSIP?: boolean;

//   @ApiProperty({
//     example: 5000,
//     description: 'Monthly SIP amount',
//     required: false,
//   })
//   @IsNumber()
//   @IsOptional()
//   @Min(0)
//   sipAmount?: number;

//   @ApiProperty({
//     example: '2024-01-15T00:00:00Z',
//     description: 'SIP start date',
//     required: false,
//   })
//   @Type(() => Date)
//   @IsDate()
//   @IsOptional()
//   sipStartDate?: Date;

//   @ApiProperty({
//     example: 60,
//     description: 'SIP duration in months',
//     required: false,
//   })
//   @IsNumber()
//   @IsOptional()
//   @Min(1)
//   sipDuration?: number;
// }
