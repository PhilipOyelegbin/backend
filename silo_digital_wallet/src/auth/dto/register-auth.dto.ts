import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { LoginAuthDto } from './login-auth.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RegisterAuthDto extends PartialType(LoginAuthDto) {
  @ApiProperty({
    description: 'First name',
    type: String,
    example: 'Jonathan',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @ApiProperty({
    description: 'Last name',
    type: String,
    example: 'Oddegard',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  last_name: string;

  @ApiPropertyOptional({
    description: 'Phone number',
    type: String,
    example: '+234824084925610',
  })
  @IsOptional()
  @IsString()
  phone_number: string;
}
