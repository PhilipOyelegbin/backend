import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { SignUpDto } from 'src/auth/dto';

export class UpdateUserDto extends PartialType(SignUpDto) {
  @ApiPropertyOptional({ description: 'The name of the user' })
  @IsOptional()
  name: string;

  @ApiPropertyOptional({ description: 'The email of the user' })
  @IsOptional()
  email: string;

  @ApiPropertyOptional({ description: 'The phone number of the user' })
  @IsOptional()
  phone_number: string;

  @ApiPropertyOptional({ description: 'The address of the user' })
  @IsOptional()
  address: string;

  @ApiPropertyOptional({ description: 'The password of the user' })
  @IsOptional()
  password: string;
}
