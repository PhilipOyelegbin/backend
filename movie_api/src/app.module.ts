import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MovieModule } from './movie/movie.module';
import { ReservationModule } from './reservation/reservation.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { TheaterModule } from './theater/theater.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    MovieModule,
    TheaterModule,
    ReservationModule,
    PrismaModule,
  ],
})
export class AppModule {}
