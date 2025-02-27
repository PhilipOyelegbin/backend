import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class BlacklistTokenDto {
  @ApiProperty({
    description: 'Access toen to be balcklisted',
    example: 'kfkefekwohehofhvoj',
  })
  @IsString({ message: 'Access token must be a string' })
  @IsNotEmpty({ message: 'Access token cannot be empty' })
  access_token: string;
}
