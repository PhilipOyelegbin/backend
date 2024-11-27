import { IsNotEmpty } from 'class-validator';
import { SignInDto } from './signin.dto';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto extends SignInDto {
  @ApiProperty({
    description: 'The name of the user',
    required: true,
    example: 'John Doe',
  })
  @IsNotEmpty({ message: 'Name cannot be empty' })
  name: string;
}
