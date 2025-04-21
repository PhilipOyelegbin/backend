import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdatePasswordDto, UpdateUserDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as argon from 'argon2';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async displayUser(id: string) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) throw new NotFoundException('User not found');

      return { message: 'User data found', data: user };
    } catch (error) {
      throw error;
    }
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) throw new NotFoundException('User not found');

      await this.userRepository.update(user.id, { ...dto });

      return { message: 'User data updated' };
    } catch (error) {
      throw error;
    }
  }

  async updateUserPassword(id: string, dto: UpdatePasswordDto) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) throw new NotFoundException('User not found');

      const verifyPassword = await argon.verify(user.password, dto.oldPassword);
      if (!verifyPassword)
        throw new BadRequestException('Old password is incorrect');

      const hashPassword = await argon.hash(dto.password);

      await this.userRepository.update(user.id, { password: hashPassword });

      return { message: 'User data updated' };
    } catch (error) {
      throw error;
    }
  }

  async removeUser(id: string) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) throw new NotFoundException('User not found');

      await this.userRepository.delete(user.id);

      return { message: 'User data deleted' };
    } catch (error) {
      throw error;
    }
  }
}
