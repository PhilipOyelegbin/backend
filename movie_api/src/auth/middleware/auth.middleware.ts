import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
// middleware for movie and theater role based authorization
export class MovieRoleAuth implements NestMiddleware {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.split(' ')[1];
    if (!bearerToken) {
      throw new BadRequestException('Token must be provided');
    }

    const decoded = await this.jwt.verify(bearerToken);
    const user = await this.prisma.user.findUnique({
      where: { id: decoded.sub },
    });
    delete user.password;

    if (user.role === 'Customer') {
      if (req.method !== 'GET') {
        throw new ForbiddenException('Customers can only perform GET requests');
      }
    }

    req.user = user;
    next();
  }
}

// middleware for reservation role based authorization
export class ReserviationRoleAuth implements NestMiddleware {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.split(' ')[1];
    if (!bearerToken) {
      throw new BadRequestException('Token must be provided');
    }

    const decoded = await this.jwt.verify(bearerToken);
    const user = await this.prisma.user.findUnique({
      where: { id: decoded.sub },
    });
    delete user.password;

    if (user.role === 'Customer') {
      if (req.method !== 'GET') {
        throw new ForbiddenException('Customers can only perform GET requests');
      }
    }

    req.user = user;
    next();
  }
}
