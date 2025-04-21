import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/db.config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { WalletModule } from './wallet/wallet.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailConfig } from './config/mail.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    MailerModule.forRootAsync({
      useClass: MailConfig, // Use the MailConfig class
    }),
    AuthModule,
    UserModule,
    WalletModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
