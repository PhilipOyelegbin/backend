import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  constructor(private stripe: Stripe) {}
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
        success_url: `${process.env.BASE_URL}/feedback`,
        cancel_url: `${process.env.BASE_URL}`,
      });
      return { checkout_url: session.url };
    } catch (error) {
      throw error;
    }
  }

  findAll() {
    return `This action returns all payment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
