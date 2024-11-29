import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { MovieRoleAuth } from 'src/auth/middleware';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME },
    }),
  ],
  controllers: [MovieController],
  providers: [MovieService, JwtStrategy],
})
export class MovieModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MovieRoleAuth)
      .exclude({ path: '*', method: RequestMethod.GET })
      .forRoutes(MovieController);
  }
}
