import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserProfileDto {
  @ApiProperty({
    example: 'clnxx123xxx',
    description: 'User ID',
  })
  id!: string;

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

  @ApiPropertyOptional({
    example: '+1234567890',
    description: 'User phone number',
  })
  phone?: string | null;

  @ApiProperty({
    example: '2026-01-29T10:00:00Z',
    description: 'Account creation date',
  })
  createdAt!: Date;

  @ApiProperty({
    example: '2026-01-29T10:00:00Z',
    description: 'Last update date',
  })
  updatedAt!: Date;
}
