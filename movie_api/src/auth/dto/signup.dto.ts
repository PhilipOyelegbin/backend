import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { SignInDto } from './signin.dto';

export class SignUpDto extends SignInDto {
  @ApiProperty({
    description: 'The name of the user',
    required: true,
    example: 'John Doe',
  })
  @IsString({ message: 'The name must be a string' })
  @IsNotEmpty({ message: 'The name can not be blank' })
  name: string;

  @ApiPropertyOptional({
    description: 'The phone number of the user',
    example: '+23480XXXXXXXX',
  })
  @IsString({ message: 'The user phone munber must be a string' })
  @IsOptional()
  phone_number: string;

  @ApiPropertyOptional({
    description: 'The address of the user',
    example: '15B Ikeja Lagos',
  })
  @IsString({ message: 'The user address must be a string' })
  @IsOptional()
  address: string;
}
