import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UseGuards,
  Query,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto, UpdateMovieDto } from './dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../auth/guard/role.guard';
import { Roles } from '../auth/decorator/role.decorator';

@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'The user is not unathorized to perform this action',
})
@ApiOkResponse({ description: 'Successfull' })
@UseGuards(JwtGuard, RolesGuard)
@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post()
  @Roles('Admin')
  @UseInterceptors(FileInterceptor('cover_image'))
  create(
    @Body() dto: CreateMovieDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10000000 }),
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.movieService.create(dto, file.originalname, file.buffer);
  }

  @Get()
  findAll() {
    return this.movieService.findAll();
  }

  @ApiOkResponse({ description: 'Searched successfully' })
  @ApiQuery({ name: 'title', required: false, type: String })
  @ApiQuery({ name: 'price', required: false, type: String })
  @Get('search')
  search(@Query('title') title: string, @Query('price') price: string) {
    return this.movieService.search(title, price);
  }

  @ApiOkResponse({ description: 'Filtered successfully' })
  @ApiQuery({ name: 'category', required: false, type: String })
  @Get('filter')
  filterByCriteria(@Query('category') category: string) {
    return this.movieService.filter(category);
  }

  @ApiParam({ name: 'id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movieService.findOne(id);
  }

  @ApiParam({ name: 'id' })
  @Patch(':id')
  @Roles('Admin')
  @UseInterceptors(FileInterceptor('cover_image'))
  update(
    @Param('id') id: string,
    @Body() dto: UpdateMovieDto,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.movieService.update(id, dto, file?.originalname, file?.buffer);
  }

  @ApiParam({ name: 'id' })
  @Delete(':id')
  @Roles('Admin')
  remove(@Param('id') id: string) {
    return this.movieService.remove(id);
  }
}
