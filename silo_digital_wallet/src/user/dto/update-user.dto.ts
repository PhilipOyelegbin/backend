import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { RegisterAuthDto } from '../../auth/dto/register-auth.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(RegisterAuthDto) {
  @ApiPropertyOptional({
    description: "User's security question",
    example: "What is your pet's name?",
  })
  @IsOptional()
  @IsString()
  security_question?: string;

  @ApiPropertyOptional({
    description: "User's security answer",
    example: 'Fluffy',
  })
  @IsOptional()
  @IsString()
  security_answer?: string;
}
