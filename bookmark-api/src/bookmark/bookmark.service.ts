import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto, UpdateBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createBookmarkDto: CreateBookmarkDto) {
    try {
      const bookmark = await this.prisma.bookmark.create({
        data: { userId, ...createBookmarkDto },
      });
      return bookmark;
    } catch (error) {
      throw error;
    }
  }

  async findAll(userId: string) {
    try {
      const bookmark = await this.prisma.bookmark.findMany({
        where: { userId },
      });
      if (!bookmark) throw new NotFoundException('No bookmark found');

      return bookmark;
    } catch (error) {
      throw error;
    }
  }

  async findOne(userId: string, bookmarkId: string) {
    try {
      const bookmark = await this.prisma.bookmark.findFirst({
        where: { id: bookmarkId, userId },
      });
      if (!bookmark)
        throw new NotFoundException('Bookmark with the provided ID not found');

      return bookmark;
    } catch (error) {
      throw error;
    }
  }

  async update(
    userId: string,
    bookmarkId: string,
    updateBookmarkDto: UpdateBookmarkDto,
  ) {
    try {
      const bookmark = await this.prisma.bookmark.findUnique({
        where: { id: bookmarkId, userId },
      });
      if (!bookmark)
        throw new NotFoundException('Bookmark with the provided ID not found');

      const editBookmark = await this.prisma.bookmark.update({
        where: { id: bookmarkId, userId },
        data: { ...updateBookmarkDto },
      });
      return editBookmark;
    } catch (error) {
      throw error;
    }
  }

  async remove(userId: string, bookmarkId: string) {
    try {
      const bookmark = await this.prisma.bookmark.findUnique({
        where: { id: bookmarkId, userId },
      });
      if (!bookmark)
        throw new NotFoundException('Bookmark with the provided ID not found');

      await this.prisma.bookmark.delete({
        where: { id: bookmarkId, userId },
      });
    } catch (error) {
      throw error;
    }
  }
}
