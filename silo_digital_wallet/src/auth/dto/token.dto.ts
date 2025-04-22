import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class TokenDto {
  @ApiProperty({
    description: 'Token',
    example: 'Ej3w}me6}9Uv{lr@',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  token: string;
}
