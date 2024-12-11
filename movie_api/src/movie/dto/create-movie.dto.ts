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

  @ApiPropertyOptional({
    description: 'The cover image of the movie must be a file upload',
    example: '/path_to_file',
  })
  @IsOptional()
  @IsString({ message: 'The cover image must be a string of file path' })
  cover_image: string;

  @ApiProperty({
    description: 'The showtime of the movie',
    example: '2023-11-28, 18:30',
  })
  @IsNotEmpty({ message: 'The show time cannot be blank' })
  @IsString({ message: 'The show time must be a string' })
  show_time: string;
}
