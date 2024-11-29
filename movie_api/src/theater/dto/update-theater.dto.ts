import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CreateTheaterDto } from './create-theater.dto';

export class UpdateTheaterDto extends PartialType(CreateTheaterDto) {
  @ApiPropertyOptional({
    description: 'The name of the theater',
    example: '',
  })
  @IsOptional()
  name: string;

  @ApiPropertyOptional({
    description: 'The address of the theater',
    example: '',
  })
  @IsOptional({ message: 'The address must be a string' })
  address: string;

  @ApiPropertyOptional({
    description: 'The capacity of the theater',
    example: 500,
  })
  @IsOptional()
  capacity: number;
}
