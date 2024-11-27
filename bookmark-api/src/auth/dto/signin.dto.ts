import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    description: 'The email of the user',
    required: true,
    example: 'jd@gmail.com',
  })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  @IsEmail({}, { message: 'Must be a valid email' })
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    required: true,
    example: 'Jd@1234.',
  })
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @MinLength(6, { message: 'Password must have minmum of 6 character' })
  password: string;
}
