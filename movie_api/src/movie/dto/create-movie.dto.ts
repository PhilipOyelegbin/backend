import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMovieDto {
  @ApiProperty({
    description: 'The title of the movie',
    example: 'The Shawshank Redemption',
  })
  @IsNotEmpty({ message: 'The title can not be blank' })
  @IsString({ message: 'The title must be a string' })
  title: string;

  @ApiPropertyOptional({
    description: 'The description of the movie',
    example:
      'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
  })
  @IsString({ message: 'The description must be a string' })
  @IsOptional()
  description: string;

  @ApiPropertyOptional({
    description: 'The cover image of the movie must be a file upload',
    example: '/path_to_file',
  })
  @IsOptional()
  @IsString({ message: 'The cover image must be a string of file path' })
  cover_image: string;

  @ApiProperty({
    description: 'The show time of the movie in 24 hours',
    example: '11:30:00',
  })
  @IsNotEmpty({ message: 'The show time cannot be blank' })
  @IsString({ message: 'The show time must be a string' })
  show_time: string;

  @ApiProperty({
    description: 'The show date of the movie',
    example: '2025-03-26',
  })
  @IsNotEmpty({ message: 'The show date cannot be blank' })
  @IsDateString({}, { message: 'The show date must be a date string' })
  show_date: string;

  @ApiProperty({ description: 'The price of the movie', example: '200.00' })
  @IsNotEmpty({ message: 'The price can not be empty' })
  @IsString({ message: 'The price must be a string' })
  price: string;
}
