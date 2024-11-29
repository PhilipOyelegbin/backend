import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto, SignUpDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  // function to register a new user
  async register(dto: SignUpDto) {
    try {
      const hash = await argon.hash(dto.password);

      const user = await this.prisma.user.create({
        data: {
          name: dto.name,
          email: dto.email,
          phone_number: dto.phone_number,
          address: dto.address,
          password: hash,
        },
      });

      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Credentials Taken');
        }
      }
      throw error;
    }
  }

  // function to login as a customer
  async login(dto: SignInDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (!user) throw new UnauthorizedException('Invalid credential');

      const isValidPassword = await argon.verify(user.password, dto.password);
      if (!isValidPassword)
        throw new UnauthorizedException('Invalid Credential');

      return this.signToken(user.id, user.email);
    } catch (error) {
      throw error;
    }
  }

  // function to login as an admin
  async admin(dto: SignInDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (!user) throw new UnauthorizedException('Invalid credential');

      const isValidPassword = await argon.verify(user.password, dto.password);
      if (!isValidPassword)
        throw new UnauthorizedException('Invalid Credential');

      return this.signToken(user.id, user.email);
    } catch (error) {
      throw error;
    }
  }

  // function to generate a token
  async signToken(userId: string, email: string) {
    const payload = { sub: userId, email };

    const token = await this.jwt.signAsync(payload, {
      expiresIn: this.config.get<string>('JWT_EXPIRATION_TIME'),
      secret: this.config.get<string>('JWT_SECRET_KEY'),
    });

    return { access_token: token };
  }
}
