import { Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TheaterController } from './theater.controller';
import { TheaterService } from './theater.service';
import { JwtStrategy } from '../auth/strategy/jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME },
    }),
  ],
  controllers: [TheaterController],
  providers: [TheaterService, JwtStrategy],
})
export class TheaterModule implements NestModule {
  configure() {}
}
