import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  Matches,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class LoginAuthDto {
  @ApiProperty({
    description: 'Email address',
    example: 'jo@gmail.com',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString({ message: 'email must be a string' })
  email: string;

  @ApiProperty({
    description: 'Password',
    example: 'Ej3w}me6}9Uv{lr@',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString({ message: 'password must be a string' })
  @MinLength(8, { message: 'The password must be minimum of 8 characters' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()-_=+[\]{};':",.<>/?\\|])\S{8,}$/,
    {
      message:
        'Minimum 8 characters, at least one uppercase, one lowercase, one number, and one special character, and no spaces',
    },
  )
  password: string;

  @ApiPropertyOptional({
    description: 'Remember Me',
    example: true,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  remember_me?: boolean;
}
