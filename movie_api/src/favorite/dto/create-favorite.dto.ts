import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFavoriteDto {
  @ApiProperty({
    description: 'The Id of the movie to add as favorite',
    example: 'kjkfjwelfkjejfkwfl',
  })
  @IsString({ message: 'Movie Id must be a string' })
  @IsNotEmpty({ message: 'Movie Id can not be empty' })
  movieId: string;
}
