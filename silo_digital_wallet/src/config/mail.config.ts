import { Injectable } from '@nestjs/common';
import { MailerOptions, MailerOptionsFactory } from '@nestjs-modules/mailer';

@Injectable()
export class MailConfig implements MailerOptionsFactory {
  constructor() {}

  createMailerOptions(): MailerOptions {
    return {
      transport: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      },
      defaults: {
        from: `Silo Digital Wallet <${process.env.SMTP_USER}>`,
      },
    };
  }
}
