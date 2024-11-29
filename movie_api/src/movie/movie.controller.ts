import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto, UpdateMovieDto } from './dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'The user is not unathorized to perform this action',
})
@ApiOkResponse({ description: 'Successfull' })
@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post()
  create(@Body() dto: CreateMovieDto) {
    return this.movieService.create(dto);
  }

  @Get()
  findAll() {
    return this.movieService.findAll();
  }

  @ApiParam({ name: 'id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movieService.findOne(id);
  }

  @ApiParam({ name: 'id' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMovieDto) {
    return this.movieService.update(id, dto);
  }

  @ApiParam({ name: 'id' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.movieService.remove(id);
  }
}
