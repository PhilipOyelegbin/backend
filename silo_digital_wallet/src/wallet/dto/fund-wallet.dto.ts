import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateWalletDto } from './create-wallet.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class FundWalletDto extends PartialType(CreateWalletDto) {
  @ApiProperty({
    description: 'The amount to fund the wallet',
    type: Number,
    example: 1000,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
