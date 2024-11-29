import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { TheaterService } from './theater.service';
import { CreateTheaterDto, UpdateTheaterDto } from './dto';

@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'The user is not unathorized to perform this action',
})
@ApiOkResponse({ description: 'Successfull' })
@Controller('theaters')
export class TheaterController {
  constructor(private readonly theaterService: TheaterService) {}

  @Post()
  create(@Body() dto: CreateTheaterDto) {
    return this.theaterService.create(dto);
  }

  @Get()
  findAll() {
    return this.theaterService.findAll();
  }

  @ApiParam({ name: 'id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.theaterService.findOne(id);
  }

  @ApiParam({ name: 'id' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTheaterDto) {
    return this.theaterService.update(id, dto);
  }

  @ApiParam({ name: 'id' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.theaterService.remove(id);
  }
}
