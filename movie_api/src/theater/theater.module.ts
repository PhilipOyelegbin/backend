import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MovieRoleAuth } from 'src/auth/middleware';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/strategy';
import { TheaterController } from './theater.controller';
import { TheaterService } from './theater.service';

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
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MovieRoleAuth)
      .exclude({ path: '*', method: RequestMethod.GET })
      .forRoutes(TheaterController);
  }
}
