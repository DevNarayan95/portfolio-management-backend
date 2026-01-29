import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token',
  })
  accessToken!: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT refresh token',
  })
  refreshToken!: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'User email',
  })
  email!: string;

  @ApiPropertyOptional({
    example: 'John',
    description: 'User first name',
  })
  firstName?: string | null;

  @ApiPropertyOptional({
    example: 'Doe',
    description: 'User last name',
  })
  lastName?: string | null;
}
