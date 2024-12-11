import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ description: 'The amount of the order', example: 500 })
  @IsNumber({}, { message: 'The amount must be a number' })
  @IsNotEmpty({ message: 'The amount must not be empty' })
  amount: number;

  @ApiProperty({
    description: 'The name of the order',
    example: 'The Shawshank Redemption',
  })
  @IsString({ message: 'The name must be a string' })
  @IsNotEmpty({ message: 'The name must not be empty' })
  name: string;

  @ApiProperty({
    description: 'The description of the order',
    example:
      'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
  })
  @IsString({ message: 'The description must be a string' })
  @IsNotEmpty({ message: 'The description must not be empty' })
  description: string;

  @ApiProperty({ description: 'The quantity of the order', example: 2 })
  @IsNumber({}, { message: 'The quantity must be a number' })
  @IsNotEmpty({ message: 'The quantity must not be empty' })
  quantity: number;
}
