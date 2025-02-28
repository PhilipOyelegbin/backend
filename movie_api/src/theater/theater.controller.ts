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
import { TheaterService } from './theater.service';
import { CreateTheaterDto, UpdateTheaterDto } from './dto';
import { JwtGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../auth/guard/role.guard';
import { Roles } from '../auth/decorator/role.decorator';

@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'The user is unathorized to perform this action',
})
@ApiInternalServerErrorResponse({
  description: 'Internal server error',
})
@UseGuards(JwtGuard, RolesGuard)
@Controller('theaters')
export class TheaterController {
  constructor(private readonly theaterService: TheaterService) {}

  @ApiCreatedResponse({ description: 'Created Successfull' })
  @Post()
  @Roles('Admin')
  create(@Body() dto: CreateTheaterDto) {
    return this.theaterService.create(dto);
  }

  @ApiOkResponse({ description: 'Successfull' })
  @Get()
  findAll() {
    return this.theaterService.findAll();
  }

  @ApiOkResponse({ description: 'Successfull' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.theaterService.findOne(id);
  }

  @ApiAcceptedResponse({ description: 'Data accepted' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @HttpCode(HttpStatus.ACCEPTED)
  @Patch(':id')
  @Roles('Admin')
  update(@Param('id') id: string, @Body() dto: UpdateTheaterDto) {
    return this.theaterService.update(id, dto);
  }

  @ApiNoContentResponse({ description: 'Deleted successfully' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @Roles('Admin')
  remove(@Param('id') id: string) {
    return this.theaterService.remove(id);
  }
}
