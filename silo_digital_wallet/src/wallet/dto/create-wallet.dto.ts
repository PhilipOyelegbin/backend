import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWalletDto {
  @ApiProperty({
    description: 'The wallet cuurency',
    type: String,
    example: 'USD',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  currency: string;
}
