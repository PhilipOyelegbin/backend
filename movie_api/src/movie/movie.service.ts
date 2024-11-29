import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto, UpdateMovieDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MovieService {
  constructor(private prisma: PrismaService) {}

  // function to add a movie to the database
  async create(dto: CreateMovieDto) {
    try {
      const movie = await this.prisma.movie.create({
        data: {
          title: dto.title,
          description: dto.description,
          cover_image: dto.cover_image,
          show_time: dto.show_time,
        },
      });

      return movie;
    } catch (error) {
      throw error;
    }
  }

  // function to find all movies from the database
  async findAll() {
    try {
      const movie = await this.prisma.movie.findMany();
      return movie;
    } catch (error) {
      throw error;
    }
  }

  // function to find a movie from the database
  async findOne(id: string) {
    try {
      const movie = await this.prisma.movie.findUnique({ where: { id } });
      if (!movie)
        throw new NotFoundException(
          'Movie with the provdied ID does not exist.',
        );

      return movie;
    } catch (error) {
      throw error;
    }
  }

  // function to update a movie in the database
  async update(id: string, dto: UpdateMovieDto) {
    try {
      const movie = await this.prisma.movie.update({
        where: { id },
        data: <any>{ ...dto },
      });
      if (!movie)
        throw new NotFoundException(
          'Movie with the provdied ID does not exist.',
        );

      return movie;
    } catch (error) {
      throw error;
    }
  }

  // function to delete a movie from the database
  async remove(id: string) {
    try {
      const movie = await this.prisma.movie.delete({ where: { id } });
      if (!movie)
        throw new NotFoundException(
          'Movie with the provdied ID does not exist.',
        );

      return { message: 'Movie deleted.' };
    } catch (error) {
      throw error;
    }
  }
}
