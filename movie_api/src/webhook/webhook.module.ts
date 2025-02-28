import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { ReservationService } from '../reservation/reservation.service';
import { NotificationService } from '../notification/notification.service';
import { ReservationModule } from '../reservation/reservation.module';

@Module({
  imports: [ReservationModule],
  controllers: [WebhookController],
  providers: [ReservationService, NotificationService],
})
export class WebhookModule {}
