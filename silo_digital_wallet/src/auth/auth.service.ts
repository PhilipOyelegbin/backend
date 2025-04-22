import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginAuthDto, RegisterAuthDto } from './dto';
import * as crypto from 'crypto';
import * as argon from 'argon2';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailerService: MailerService,
    private readonly jwt: JwtService,
  ) {}

  async registerUser(dto: RegisterAuthDto) {
    try {
      const emailExist = await this.userRepository.findOne({
        where: { email: dto.email },
      });
      if (emailExist) {
        throw new BadRequestException('Email already exists');
      }

      const hashPassword = await argon.hash(dto.password);
      const verificationToken = crypto.randomBytes(8).toString('hex');
      const verificationTokenExpiration = Date.now() + 3600000;

      const user = this.userRepository.create({
        ...dto,
        password: hashPassword,
        verification_token: verificationToken,
        verification_token_expiration: verificationTokenExpiration.toString(),
      });

      // Send verification email
      await this.mailerService.sendMail({
        to: dto.email,
        subject: 'Verify your Email',
        html: `<p>Hello ${user.first_name},</p>

        <p>Thank you for signing up, you only have one step left, kindly verify using the token: <b>${verificationToken}</b> to complete our signup process</p>

        <p>Warm regards,</p>

        <p>Silo Digital Wallet Team</p>
        `,
      });

      await this.userRepository.save(user);

      delete user.password;
      delete user.verification_token;
      delete user.verification_token_expiration;
      return { message: 'Registration successful', data: user };
    } catch (error) {
      throw error;
    }
  }

  async verifyEmail(token: string): Promise<boolean> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          verification_token: token,
          verification_token_expiration: MoreThanOrEqual(Date.now().toString()),
        },
      });
      if (!user) return false;

      user.isVerified = true;
      user.verification_token = null;
      user.verification_token_expiration = null;
      await this.userRepository.save(user);

      return true;
    } catch (error) {
      throw error;
    }
  }

  async resendVerificationEmail(email: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
      });
      if (!user) throw new NotFoundException('User not found');

      const verificationToken = crypto.randomBytes(8).toString('hex');
      const verificationTokenExpiration = Date.now() + 3600000;

      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Verify your Email',
        html: `<p>Hello ${user.first_name},</p>

        <p>Thank you for signing up, you only have one step left, kindly verify using the token: <b>${verificationToken}</b> to complete our signup process</p>

        <p>Warm regards,</p>

        <p>Silo Digital Wallet Team</p>
        `,
      });

      user.verification_token = verificationToken;
      user.verification_token_expiration =
        verificationTokenExpiration.toString();

      return { message: 'Verification email resent successfully' };
    } catch (error) {
      throw error;
    }
  }

  async loginUser(dto: LoginAuthDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { email: dto.email },
      });

      // If validation fails
      if (!user) {
        throw new UnauthorizedException('Invalid Credential');
      }

      const isValidPassword = await argon.verify(user.password, dto.password);

      // If validation fails
      if (!isValidPassword) {
        throw new UnauthorizedException('Invalid Credential');
      }

      // Proceed with your normal login logic (e.g., generating JWT)
      const token = await this.signToken(user.id, user.email, user.isAdmin);

      return { message: 'Login successful', token: token.access_token };
    } catch (error) {
      throw error;
    }
  }

  async forgotPassword(email: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
      });
      if (!user) throw new NotFoundException('User not found');

      const resetToken = crypto.randomBytes(8).toString('hex');
      const resetTokenExpiration = Date.now() + 3600000;

      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Verify your Email',
        html: `<p>Hello ${user.first_name},</p>

        <p>Thank you for signing up, you only have one step left, kindly verify using the token: <b>${resetToken}</b> to complete our signup process</p>

        <p>Warm regards,</p>

        <p>Silo Digital Wallet Team</p>
        `,
      });

      user.reset_token = resetToken;
      user.reset_token_expiration = resetTokenExpiration.toString();

      return { message: 'Reset email sent successfully' };
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(token: string, password: string) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          reset_token: token,
          reset_token_expiration: MoreThanOrEqual(Date.now().toString()),
        },
      });
      if (!user) throw new BadRequestException('Invalid token');

      const hashpassword = await argon.hash(password);
      user.password = hashpassword;

      return { message: 'Password reset successful' };
    } catch (error) {
      throw error;
    }
  }

  async signToken(userId: string, email: string, isAdmin: boolean) {
    const payload = { sub: userId, email, isAdmin };

    const access_token = await this.jwt.signAsync(payload, {
      expiresIn: process.env.JWT_EXPIRATION_TIME,
      secret: process.env.JWT_SECRET_KEY,
    });

    return { access_token };
  }

  async logoutUser(token: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { blacklisted_token: token },
      });
      if (!user) throw new NotFoundException('Token not blacklisted');

      user.blacklisted_token = token;

      return { message: 'Logout successful' };
    } catch (error) {
      throw error;
    }
  }
}
