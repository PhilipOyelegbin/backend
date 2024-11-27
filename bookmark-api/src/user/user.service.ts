import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async updateUserById(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { ...updateUserDto },
    });

    delete user.password;
    return user;
  }

  async deleteUserById(userId: string) {
    const user = await this.prisma.user.delete({ where: { id: userId } });

    return user;
  }
}
