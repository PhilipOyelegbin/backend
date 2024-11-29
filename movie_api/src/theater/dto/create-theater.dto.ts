import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTheaterDto {
  @ApiProperty({
    description: 'The name of the theater',
    example: 'Cineplex',
  })
  @IsNotEmpty({ message: 'The name can not be blank' })
  @IsString({ message: 'The name must be a string' })
  name: string;

  @ApiProperty({
    description: 'The address of the theater',
    example: '123 Main St, Anytown, CA 12345',
  })
  @IsNotEmpty({ message: 'The address can not be blank' })
  @IsString({ message: 'The address must be a string' })
  address: string;

  @ApiProperty({
    description: 'The capacity of the theater',
    example: 200,
  })
  @IsNotEmpty({ message: 'The capacity cannot be blank' })
  @IsNumber({}, { message: 'The capacity must be a number' })
  capacity: number;
}
