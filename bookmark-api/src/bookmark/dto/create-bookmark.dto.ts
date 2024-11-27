import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateBookmarkDto {
  @ApiProperty({
    description: 'The title of the bookmark',
    required: true,
    example: 'NestJS API Professional Grade Documentation',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'The description of the bookmark',
    example: 'Learn how to easily document your nestjs API endpoints',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'The link of the bookmark',
    required: true,
    example: 'https://youtu.be/DG0uZ0E8DBs?si=AotxiNFSqH2o3Lwu',
  })
  @IsNotEmpty()
  @IsString()
  link: string;
}
