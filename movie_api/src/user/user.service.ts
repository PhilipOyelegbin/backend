import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // function to update the loggedin user
  async update(id: string, dto: UpdateUserDto) {
    try {
      if (dto.password) {
        const hashed = await argon.hash(dto.password);

        const user = await this.prisma.user.update({
          where: { id },
          data: { ...dto, password: hashed },
        });

        delete user.password;
        return user;
      }

      // if no password is provided, update the user without changing the password
      const user = await this.prisma.user.update({
        where: { id },
        data: { ...dto },
      });

      delete user.password;
      return user;
    } catch (error) {
      throw error;
    }
  }

  // function to delete the loggedin user
  async remove(id: string) {
    try {
      await this.prisma.user.delete({ where: { id } });

      return { mesaage: 'User deleted' };
    } catch (error) {
      throw error;
    }
  }
}
