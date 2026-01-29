// // src/modules/user/dtos/update-profile.dto.ts
// import { IsString, IsOptional, IsPhoneNumber } from 'class-validator';
// import { ApiPropertyOptional } from '@nestjs/swagger';

// export class UpdateProfileDto {
//   @ApiPropertyOptional({
//     example: 'John',
//     description: 'First name',
//   })
//   @IsString()
//   @IsOptional()
//   firstName?: string;

//   @ApiPropertyOptional({
//     example: 'Doe',
//     description: 'Last name',
//   })
//   @IsString()
//   @IsOptional()
//   lastName?: string;

//   @ApiPropertyOptional({
//     example: '+1234567890',
//     description: 'Phone number',
//   })
//   @IsPhoneNumber(undefined, { message: 'Invalid phone number' })
//   @IsOptional()
//   phone?: string;
// }
