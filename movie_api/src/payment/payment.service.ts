import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentService {
  stripe = new Stripe(this.config.getOrThrow('STRIPE_SECRET_KEY'));

  constructor(private readonly config: ConfigService) {}

  async create(dto: CreatePaymentDto) {
    try {
      const session = await this.stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: { name: dto.name, description: dto.description },
              unit_amount: dto.amount * 100,
            },
            quantity: dto.quantity,
          },
        ],
        mode: 'payment',
        success_url: `${this.config.getOrThrow('BASE_URL')}/feedback`,
        cancel_url: `${this.config.getOrThrow('BASE_URL')}`,
      });
      return { checkout_url: session.url };
    } catch (error) {
      throw error;
    }
  }

  findAll() {
    return `This action returns all payment`;
  }

  findOne(id: string) {
    return `This action returns a #${id} payment`;
  }
}
