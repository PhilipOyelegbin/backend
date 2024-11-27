import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignInDto, SignUpDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { config } from 'dotenv';

config();

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signup(signUpDto: SignUpDto) {
    try {
      // hash the passowrd from the signUpDto
      const hashedPassword = await argon.hash(signUpDto.password);

      // save the new user in the db
      const user = await this.prisma.user.create({
        data: <any>{
          name: signUpDto.name,
          email: signUpDto.email,
          password: hashedPassword,
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

  async signin(signInDto: SignInDto) {
    try {
      // check if the user with the email from the sigInDto exist
      const user = await this.prisma.user.findUnique({
        where: { email: signInDto.email },
      });
      if (!user) throw new BadRequestException('Bad credentials');

      // match the passowrd from the sigInDto exist
      const isValidPassword = await argon.verify(
        user.password,
        signInDto.password,
      );
      if (!isValidPassword)
        throw new ForbiddenException('Credentials Incorrect');

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

  async signToken(
    userId: string,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = { sub: userId, email };
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.JWT_EXPIRATION_TIME,
      secret: process.env.JWT_SECRET_KEY,
    });

    return { access_token: token };
  }
}
