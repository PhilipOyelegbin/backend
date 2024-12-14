import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateReservationDto {
  @ApiProperty({
    description: 'The number of ticket for the reservation',
    example: 2,
  })
  @IsNotEmpty({ message: 'The number of ticket can not be blank' })
  @IsNumber({}, { message: 'The number of ticket must be a string' })
  num_ticket: number;

  @ApiProperty({
    description: 'The ticket price for the reservation',
    example: 50.25,
  })
  @IsNotEmpty({ message: 'The ticket price can not be blank' })
  @IsNumber({}, { message: 'The ticket price must be a number' })
  ticket_price: number;

  @ApiProperty({
    description: 'The movie id for the reservation',
    example: 'cm42lbano0000l193sdnh9pd5',
  })
  @IsNotEmpty({ message: 'The movie id can not be blank' })
  @IsString({ message: 'The movie id must be a string' })
  movieId: string;

  @ApiProperty({
    description: 'The movie id for the reservation',
    example: 'cm42lbano0000l193sdnh9pd5',
  })
  @IsNotEmpty({ message: 'The theater id can not be blank' })
  @IsString({ message: 'The theater id must be a string' })
  theaterId: string;
}
