import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtGuard, RolesGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator/get-user.decorator';
import {
  ApiAcceptedResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateReservationDto, UpdateReservationDto } from './dto';
import { ReservationService } from './reservation.service';
import { Roles } from '../auth/decorator/role.decorator';

@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'The user is unathorized to perform this action',
})
@ApiInternalServerErrorResponse({
  description: 'Internal server error',
})
@UseGuards(JwtGuard, RolesGuard)
@Controller('reservations')
export class ReservationController {
  constructor(private reservationService: ReservationService) {}

  @ApiCreatedResponse({ description: 'Created Successfull' })
  @Post()
  @Roles('User')
  async create(
    @GetUser('id') userId: string,
    @Body() dto: CreateReservationDto,
  ) {
    return this.reservationService.createReservationAndCheckout(userId, dto);
  }

  @ApiOkResponse({ description: 'Successfull' })
  @Get()
  findAll(@GetUser('id') userId: string) {
    return this.reservationService.findAll(userId);
  }

  @ApiOkResponse({ description: 'Successfull' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @Get(':id')
  findOne(@GetUser('id') userId: string, @Param('id') reservationId: string) {
    return this.reservationService.findOne(userId, reservationId);
  }

  @ApiAcceptedResponse({ description: 'Data accepted' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @HttpCode(HttpStatus.ACCEPTED)
  @Patch(':id')
  @Roles('Admin')
  update(
    @GetUser('id') userId: string,
    @Param('id') reservationId: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationService.update(
      userId,
      reservationId,
      updateReservationDto,
    );
  }

  @ApiNoContentResponse({ description: 'Deleted successfully' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @Roles('Admin')
  remove(@GetUser('id') userId: string, @Param('id') reservationId: string) {
    return this.reservationService.remove(userId, reservationId);
  }
}
