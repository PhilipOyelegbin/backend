import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoriteService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateFavoriteDto) {
    try {
      const favorite = await this.prisma.favorite.create({
        data: { ...dto, userId },
      });
      return favorite;
    } catch (error) {
      throw error;
    }
  }

  async findAll(userId: string) {
    try {
      const favorite = await this.prisma.favorite.findFirst({
        where: { userId },
        include: { movie: true },
      });

      if (!favorite) throw new NotFoundException('No favourite added');

      return favorite;
    } catch (error) {
      throw error;
    }
  }

  async findOne(userId: string, id: string) {
    try {
      const favorite = await this.prisma.favorite.findUnique({
        where: { id, userId },
        include: { movie: true },
      });

      if (!favorite) throw new NotFoundException('No favourite added');

      return favorite;
    } catch (error) {
      throw error;
    }
  }

  async remove(userId: string, id: string) {
    try {
      const favorite = await this.prisma.favorite.findUnique({
        where: { id, userId },
      });

      if (!favorite) throw new NotFoundException('No favourite added');

      await this.prisma.favorite.delete({ where: { id: favorite.id } });

      return { message: 'Deleted successfully' };
    } catch (error) {
      throw error;
    }
  }
}
