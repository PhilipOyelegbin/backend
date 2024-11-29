import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReservationService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateReservationDto) {
    try {
      const reservation = await this.prisma.reservation.create({
        data: <any>{
          userId,
          total_price: <any>dto.ticket_price * <any>dto.num_ticket,
          ...dto,
        },
      });

      return reservation;
    } catch (error) {
      throw error;
    }
  }

  async findAll(userId: string) {
    try {
      const reservation = await this.prisma.reservation.findMany({
        where: { userId },
      });
      return reservation;
    } catch (error) {
      throw error;
    }
  }

  async findOne(userId: string, reservationId: string) {
    try {
      const reservation = await this.prisma.reservation.findUnique({
        where: { id: reservationId, userId },
      });
      if (!reservation)
        throw new NotFoundException(
          'Reservation with the provided ID does not exist.',
        );

      return reservation;
    } catch (error) {
      throw error;
    }
  }

  async update(
    userId: string,
    reservationId: string,
    dto: UpdateReservationDto,
  ) {
    try {
      const reservation = await this.prisma.reservation.update({
        where: { id: reservationId, userId },
        data: <any>{
          total_price: <number>dto.num_ticket * <number>dto.ticket_price,
          ...dto,
        },
      });
      if (!reservation)
        throw new NotFoundException(
          'Reservation with the provided ID does not exist.',
        );

      return reservation;
    } catch (error) {
      throw error;
    }
  }

  async remove(userId: string, reservationId: string) {
    try {
      const reservation = await this.prisma.reservation.delete({
        where: { id: reservationId, userId },
      });
      if (!reservation)
        throw new NotFoundException(
          'Reservation with the provided ID does not exist.',
        );

      return { message: 'Reservation deleted.' };
    } catch (error) {
      throw error;
    }
  }
}
