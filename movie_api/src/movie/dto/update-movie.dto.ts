import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateMovieDto } from './create-movie.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateMovieDto extends PartialType(CreateMovieDto) {
  @ApiPropertyOptional({
    description: 'The category of the movie',
    example: 'Drama',
  })
  @IsString({ message: 'The category must be a string' })
  @IsOptional()
  category: string;
}
