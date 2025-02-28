import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiAcceptedResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { JwtGuard } from '../auth/guard/auth.guard';

@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'The user is unathorized to perform this action',
})
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  // get the loggedin user
  @ApiOkResponse({ description: 'Retrieved successfully' })
  @Get('me')
  findOne(@GetUser() user: User) {
    try {
      return user;
    } catch (error) {
      throw error;
    }
  }

  // update the loggedin user
  @ApiAcceptedResponse({ description: 'Updated successfully' })
  @HttpCode(HttpStatus.ACCEPTED)
  @Patch('me')
  update(@GetUser('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }

  // delete the loggedin user
  @ApiNoContentResponse({ description: 'Deleted successfully' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('me')
  remove(@GetUser('id') id: string) {
    return this.userService.remove(id);
  }
}
