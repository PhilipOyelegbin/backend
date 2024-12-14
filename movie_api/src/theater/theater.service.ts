import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTheaterDto, UpdateTheaterDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TheaterService {
  constructor(private prisma: PrismaService) {}

  // function to add a theater to the database
  async create(dto: CreateTheaterDto) {
    try {
      const theater = await this.prisma.theater.create({
        data: {
          name: dto.name,
          address: dto.address,
          capacity: dto.capacity,
        },
      });

      return theater;
    } catch (error) {
      throw error;
    }
  }

  // function to find all theaters from the database
  async findAll() {
    try {
      const theater = await this.prisma.theater.findMany();
      return theater;
    } catch (error) {
      throw error;
    }
  }

  // function to find a theater from the database
  async findOne(id: string) {
    try {
      const theater = await this.prisma.theater.findUnique({ where: { id } });
      if (!theater)
        throw new NotFoundException(
          'Theater with the provided ID does not exist.',
        );

      return theater;
    } catch (error) {
      throw error;
    }
  }

  // function to update a theater in the database
  async update(id: string, dto: UpdateTheaterDto) {
    try {
      const theater = await this.prisma.theater.update({
        where: { id },
        data: <any>{ ...dto },
      });
      if (!theater)
        throw new NotFoundException(
          'Theater with the provided ID does not exist.',
        );

      return theater;
    } catch (error) {
      throw error;
    }
  }

  // function to delete a theater from the database
  async remove(id: string) {
    try {
      const theater = await this.prisma.theater.delete({ where: { id } });
      if (!theater)
        throw new NotFoundException(
          'Theater with the provdied ID does not exist.',
        );

      return { message: 'Theater deleted.' };
    } catch (error) {
      throw error;
    }
  }
}
