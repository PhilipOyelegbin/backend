import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPassword {
  @ApiProperty({
    description: 'The token of the reset password',
    example: 'fkjeiiriihrirhe',
  })
  @IsString({ message: 'Token must be a string' })
  @IsNotEmpty({ message: 'Token must not be empty' })
  resetToken: string;

  @ApiProperty({
    description: 'The new password of the account',
    example: '1234567.',
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password must not be empty' })
  password: string;
}
