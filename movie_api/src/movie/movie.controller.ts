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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto, UpdateMovieDto } from './dto';
import {
  ApiAcceptedResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../auth/guard/role.guard';
import { Roles } from '../auth/decorator/role.decorator';

@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'The user is unathorized to perform this action',
})
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@UseGuards(JwtGuard, RolesGuard)
@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @ApiCreatedResponse({ description: 'Created successfully' })
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

  @ApiOkResponse({ description: 'Found successfully' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @Get()
  findAll() {
    return this.movieService.findAll();
  }

  @ApiOkResponse({ description: 'Searched successfully' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiQuery({ name: 'title', required: false, type: String })
  @ApiQuery({ name: 'price', required: false, type: String })
  @Get('search')
  search(@Query('title') title: string, @Query('price') price: string) {
    return this.movieService.search(title, price);
  }

  @ApiOkResponse({ description: 'Filtered successfully' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiQuery({ name: 'category', required: false, type: String })
  @Get('filter')
  filterByCriteria(@Query('category') category: string) {
    return this.movieService.filter(category);
  }

  @ApiOkResponse({ description: 'Found successfully' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movieService.findOne(id);
  }

  @ApiAcceptedResponse({ description: 'Updated successfully' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @HttpCode(HttpStatus.ACCEPTED)
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

  @ApiNoContentResponse({ description: 'Deleted successfully' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @Roles('Admin')
  remove(@Param('id') id: string) {
    return this.movieService.remove(id);
  }
}
