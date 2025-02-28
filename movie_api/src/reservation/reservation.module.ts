import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { NotificationService } from '../notification/notification.service';

@Module({
  controllers: [ReservationController],
  providers: [ReservationService, NotificationService],
})
export class ReservationModule {}
