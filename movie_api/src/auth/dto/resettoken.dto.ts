import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResetToken {
  @ApiProperty({
    description: 'The email of the account',
    example: 'jd@email.com',
  })
  @IsString({ message: 'Email must be a string' })
  @IsNotEmpty({ message: 'Email ust not be empty' })
  email: string;
}
