import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateReservationDto, UpdateReservationDto } from './dto';
import { ReservationService } from './reservation.service';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('reservations')
export class ReservationController {
  constructor(private reservationService: ReservationService) {}

  @Post()
  async create(
    @GetUser('id') userId: string,
    @Body() dto: CreateReservationDto,
  ) {
    return this.reservationService.create(userId, dto);
  }

  @Get()
  findAll(@GetUser('id') userId: string) {
    return this.reservationService.findAll(userId);
  }

  @Get(':id')
  findOne(@GetUser('id') userId: string, @Param('id') reservationId: string) {
    return this.reservationService.findOne(userId, reservationId);
  }

  @Patch(':id')
  update(
    @GetUser('id') userId: string,
    @Param('id') reservationId: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationService.update(
      userId,
      reservationId,
      updateReservationDto,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@GetUser('id') userId: string, @Param('id') reservationId: string) {
    return this.reservationService.remove(userId, reservationId);
  }
}
