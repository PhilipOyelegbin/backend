import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

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

  @ApiProperty({
    description: 'The cover image of the movie',
    example:
      'https://image.tmdb.org/t/p/w500/q6725a94750c802b1ca5c3a576016e37.jpg',
  })
  @IsNotEmpty({ message: 'The cover image can not be blank' })
  @IsString({ message: 'The cover image must be a string' })
  cover_image: string;

  @ApiProperty({
    description: 'The showtime of the movie',
    example: '2023-11-28, 18:30',
  })
  @IsNotEmpty({ message: 'The show time cannot be blank' })
  @IsString({ message: 'The show time must be a string' })
  show_time: string;
}
