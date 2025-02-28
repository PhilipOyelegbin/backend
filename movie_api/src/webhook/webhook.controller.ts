import { Controller, Post, Req, Headers, RawBodyRequest } from '@nestjs/common';
import { ReservationService } from '../reservation/reservation.service';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@Controller('webhook')
export class WebhookController {
  constructor(private readonly reservationService: ReservationService) {}

  @ApiCreatedResponse({ description: 'Created successfully' })
  @Post('stripe')
  createHook(
    @Headers() headers: Record<string, string>,
    @Req() request: RawBodyRequest<Request>,
  ) {
    const payload = request;
    const signature = headers['stripe-signature'];

    if (!signature) {
      console.error('Missing Stripe signature');
      return { error: 'Missing Stripe signature' };
    }

    return this.reservationService.createStripeHook(payload, signature);
  }
}
