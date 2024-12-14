import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateReservationDto } from './create-reservation.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateReservationDto extends PartialType(CreateReservationDto) {
  @ApiPropertyOptional({
    description: 'The status of the reservation',
    example: 'Confirmed',
  })
  @IsString({ message: 'The status must be a string' })
  @IsOptional()
  status: string;
}
