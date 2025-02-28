import { Injectable, NotFoundException, RawBodyRequest } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class ReservationService {
  private stripe: Stripe;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private notification: NotificationService,
  ) {
    const stripeSecretKey = this.config.getOrThrow('STRIPE_SECRET_KEY');

    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-11-20.acacia',
    });
  }

  // create a new reservation and checkout for a movie
  async createReservationAndCheckout(
    userId: string,
    dto: CreateReservationDto,
  ) {
    try {
      const createReservation = await this.prisma.reservation.create({
        data: {
          ...dto,
          userId,
        },
      });

      const reservation = await this.prisma.reservation.findUnique({
        where: { id: createReservation.id },
        include: { user: true, movie: true, theater: true },
      });

      const session = await this.stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: reservation.movie.title,
                description: reservation.movie.description,
              },
              unit_amount: Number(reservation.movie.price) * 100,
            },
            quantity: reservation.num_ticket,
          },
        ],
        mode: 'payment',
        success_url: `${this.config.getOrThrow('BASE_URL')}/confirmaion?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${this.config.getOrThrow('BASE_URL')}`,
      });

      await this.prisma.reservation.update({
        where: { id: reservation.id },
        data: {
          sessionId: session.id,
          total_price: reservation.movie.price * reservation.num_ticket,
        },
      });

      return { checkout_url: session.url, reservationId: reservation.id };
    } catch (error) {
      throw error;
    }
  }

  // checkout fulfillment confirmation function
  private async fulfillCheckout(sessionId: string) {
    try {
      const checkoutSession = await this.stripe.checkout.sessions.retrieve(
        sessionId,
        {
          expand: ['line_items'],
        },
      );

      // condition for payment status
      if (checkoutSession.payment_status === 'paid') {
        const reservation = await this.prisma.reservation.findFirst({
          where: { sessionId: checkoutSession.id },
          include: { movie: true, user: true, theater: true },
        });

        if (!reservation) throw new NotFoundException('Reservation not found');

        if (reservation.status !== 'Confirmed') {
          await this.prisma.reservation.update({
            where: { id: reservation.id },
            data: { status: 'Confirmed' },
          });

          const subject = 'Reservation Confirmation';
          const message = `<p>Hello,</p>

          <p>Thank you for making the reservation for the movie <b>${reservation.movie.title}</b>, your reservation id is <b>${reservation.id}</b>.</p>

          <p>Warm regards,</p>

          <p>Movie Team</p>
          `;

          await this.notification.sendMail(
            reservation.user.email,
            subject,
            message,
          );

          return { message: `Reservation ${checkoutSession.id} confirmed` };
        } else {
          return {
            message: `Duplicate fulfillment attempt for reservation ${checkoutSession.id}`,
          };
        }
      }
    } catch (error) {
      throw error;
    }
  }

  // stripe webhook
  async createStripeHook(payload: RawBodyRequest<Request>, signature: string) {
    const endpointSecret = this.config.getOrThrow('STRIPE_ENDPOINT_SECRET');
    let event: any;

    try {
      event = this.stripe.webhooks.constructEvent(
        payload.rawBody,
        signature,
        endpointSecret,
      );
      console.log('Webhook verified');
    } catch (error) {
      console.log('Webhook error', error.message);
      throw error;
    }
    const data = event.data.object;
    const eventType = event.type;

    if (
      eventType === 'checkout.session.completed' ||
      eventType === 'checkout.session.async_payment_succeeded'
    ) {
      this.fulfillCheckout(data.id);
    }

    return { received: true };
  }

  async findAll(userId: string) {
    try {
      const reservation = await this.prisma.reservation.findMany({
        where: { userId },
      });
      return reservation;
    } catch (error) {
      throw error;
    }
  }

  async findOne(userId: string, reservationId: string) {
    try {
      const reservation = await this.prisma.reservation.findUnique({
        where: { id: reservationId, userId },
      });
      if (!reservation)
        throw new NotFoundException(
          'Reservation with the provided ID does not exist.',
        );

      return reservation;
    } catch (error) {
      throw error;
    }
  }

  async update(
    userId: string,
    reservationId: string,
    dto: UpdateReservationDto,
  ) {
    try {
      const existingReservation = await this.prisma.reservation.findUnique({
        where: { id: reservationId, userId },
      });
      if (!existingReservation)
        throw new NotFoundException(
          'Reservation with the provided ID does not exist.',
        );

      const reservation = await this.prisma.reservation.update({
        where: { id: existingReservation.id },
        data: <any>{ ...dto },
      });

      return reservation;
    } catch (error) {
      throw error;
    }
  }

  async remove(userId: string, reservationId: string) {
    try {
      const reservation = await this.prisma.reservation.findUnique({
        where: { id: reservationId, userId },
      });
      if (!reservation)
        throw new NotFoundException(
          'Reservation with the provided ID does not exist.',
        );

      await this.prisma.reservation.delete({
        where: { id: reservation.id },
      });

      return { message: 'Reservation deleted.' };
    } catch (error) {
      throw error;
    }
  }
}
