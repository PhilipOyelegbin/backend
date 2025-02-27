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
  ApiNoContentResponse,
  ApiOkResponse,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { TheaterService } from './theater.service';
import { CreateTheaterDto, UpdateTheaterDto } from './dto';
import { JwtGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../auth/guard/role.guard';
import { Roles } from '../auth/decorator/role.decorator';

@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'The user is not unathorized to perform this action',
})
@ApiOkResponse({ description: 'Successfull' })
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
  @ApiParam({ name: 'id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.theaterService.findOne(id);
  }

  @ApiAcceptedResponse({ description: 'Data accepted' })
  @ApiParam({ name: 'id' })
  @HttpCode(HttpStatus.ACCEPTED)
  @Patch(':id')
  @Roles('Admin')
  update(@Param('id') id: string, @Body() dto: UpdateTheaterDto) {
    return this.theaterService.update(id, dto);
  }

  @ApiNoContentResponse({ description: 'Deleted successfully' })
  @ApiParam({ name: 'id' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @Roles('Admin')
  remove(@Param('id') id: string) {
    return this.theaterService.remove(id);
  }
}
