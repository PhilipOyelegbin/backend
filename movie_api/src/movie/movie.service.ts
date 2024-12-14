import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto, UpdateMovieDto } from './dto';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MovieService {
  private readonly s3Client = new S3Client({
    region: 'auto',
    endpoint: this.configService.getOrThrow('S3_API'),
    credentials: {
      accessKeyId: this.configService.getOrThrow('ACCESS_KEY_ID'),
      secretAccessKey: this.configService.getOrThrow('SECRET_ACCESS_KEY'),
    },
  });

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  // function to add a movie to the database
  async create(dto: CreateMovieDto, fileName: string, file: Buffer) {
    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.configService.getOrThrow('BUCKET_NAME'),
          Key: fileName,
          Body: file,
        }),
      );

      const movie = await this.prisma.movie.create({
        data: {
          title: dto.title,
          description: dto.description,
          cover_image: fileName,
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

      const moviesWithImage = movie.map((list) => {
        const cover_image = `${process.env.R2_PUBLIC_ENDPOINT}/${list.cover_image}`;
        return {
          ...list,
          cover_image,
        };
      });

      return moviesWithImage;
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

      const cover_image = `${process.env.R2_PUBLIC_ENDPOINT}/${movie.cover_image}`;

      return { ...movie, cover_image };
    } catch (error) {
      throw error;
    }
  }

  // function to update a movie in the database
  async update(
    id: string,
    dto: UpdateMovieDto,
    fileName?: string,
    file?: Buffer,
  ) {
    try {
      const existingMovie = await this.prisma.movie.findUnique({
        where: { id },
      });

      if (!existingMovie) {
        throw new NotFoundException(
          'Movie with the provided ID does not exist.',
        );
      }

      let movieImage = existingMovie.cover_image || null;

      // If a new file is provided, handle the image upload and deletion
      if (fileName && file) {
        // Upload the new image
        await this.s3Client.send(
          new PutObjectCommand({
            Bucket: this.configService.getOrThrow('BUCKET_NAME'),
            Key: fileName,
            Body: file,
          }),
        );

        // Delete the old image from Cloudflare R2 if it exists
        if (movieImage) {
          await this.s3Client.send(
            new DeleteObjectCommand({
              Bucket: this.configService.getOrThrow('BUCKET_NAME'),
              Key: movieImage,
            }),
          );
        }

        // Update the movie image filename
        movieImage = fileName;
      }

      // Update the movie record in the database
      const updatedMovie = await this.prisma.movie.update({
        where: { id },
        data: <any>{
          ...dto,
          cover_image: movieImage,
        },
      });

      // Construct the full movie image URL
      const fullMovieImage = updatedMovie.cover_image
        ? `${process.env.R2_PUBLIC_ENDPOINT}/${updatedMovie.cover_image}`
        : null;

      return {
        ...updatedMovie,
        cover_image: fullMovieImage,
      };
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

      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.configService.getOrThrow('BUCKET_NAME'),
          Key: movie.cover_image,
        }),
      );

      return { message: 'Movie deleted.' };
    } catch (error) {
      throw error;
    }
  }
}
