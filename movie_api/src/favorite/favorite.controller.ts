import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { CreateFavoriteDto } from './dto';
import { JwtGuard } from '../auth/guard/auth.guard';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'The user is unathorized to perform this action',
})
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@UseGuards(JwtGuard)
@Controller('favorite')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @ApiCreatedResponse({ description: 'Created Successfull' })
  @Post()
  create(@GetUser() user: User, @Body() dto: CreateFavoriteDto) {
    return this.favoriteService.create(user.id, dto);
  }

  @ApiOkResponse({ description: 'Successfull' })
  @Get()
  findAll(@GetUser() user: User) {
    return this.favoriteService.findAll(user.id);
  }

  @ApiOkResponse({ description: 'Successfull' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @Get(':id')
  findOne(@GetUser() user: User, @Param('id') id: string) {
    return this.favoriteService.findOne(user.id, id);
  }

  @ApiNoContentResponse({ description: 'Deleted successfully' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@GetUser() user: User, @Param('id') id: string) {
    return this.favoriteService.remove(user.id, id);
  }
}
