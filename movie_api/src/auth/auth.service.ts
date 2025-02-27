import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { BlacklistTokenDto, SignInDto, SignUpDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ConfigService } from '@nestjs/config';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class AuthService {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
    private jwt: JwtService,
    private notification: NotificationService,
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
  private async signToken(userId: string, email: string) {
    const payload = { sub: userId, email };

    const token = await this.jwt.signAsync(payload, {
      expiresIn: this.config.get<string>('JWT_EXPIRATION_TIME'),
      secret: this.config.get<string>('JWT_SECRET_KEY'),
    });

    return { access_token: token };
  }

  // function for generating the reset password token for vendor
  async generateResetToken(userEmail: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: userEmail },
      });
      if (!user) {
        throw new NotFoundException('Customer not found');
      }

      // generate token and expiration time
      const resetToken = Math.random().toString(36).substr(2);
      const resetExpiration = Date.now() + 3600000; // 1 hour

      // save token and expiration time to database
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          reset_token: resetToken,
          reset_expiration: resetExpiration.toString(),
        },
      });

      // send reset token to the user
      let subject = `Password Reset Request`;
      let message = `
      <p>Hi,</p>

      <p>You requested a password reset. Here is your reset token: <b>${resetToken}</b> to reset your password.</p>

      <p>It will expire within an hour. If you did not request this, please ignore this email.</p>

      <p>Warm regards,</p>

      <p><b>Movie Team</b></p>
      `;

      await this.notification.sendMail(user.email, subject, message);

      return { resetToken };
    } catch (error) {
      throw error;
    }
  }

  // function for vendor password reset based on reset token
  async resetPassword(resetToken: string, password: string) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          reset_token: resetToken,
          reset_expiration: {
            gte: Date.now().toString(),
          },
        },
      });

      if (!user) {
        throw new NotFoundException('Invalid or expired token');
      }

      const hashed = await argon.hash(password);

      // save new hashed password
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashed,
          reset_token: null,
          reset_expiration: null,
        },
      });

      return { message: 'Password reset successful' };
    } catch (error) {
      throw error;
    }
  }

  // function to logout
  async logout(dto: BlacklistTokenDto) {
    try {
      await this.prisma.blacklistToken.create({
        data: { ...dto },
      });
      return { message: 'Logged out successfully' };
    } catch (error) {
      throw error;
    }
  }
}
