import { CreateBookmarkDto } from './create-bookmark.dto';
import { IsOptional } from 'class-validator';
import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class UpdateBookmarkDto extends PartialType(CreateBookmarkDto) {
  @ApiPropertyOptional({ description: 'The title of the bookmark' })
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: 'The link of the bookmark' })
  @IsOptional()
  link?: string;
}
