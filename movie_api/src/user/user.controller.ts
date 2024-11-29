import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { JwtGuard } from 'src/auth/guard';

@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'The user is not unathorized to perform this action',
})
@ApiOkResponse({ description: 'Successfull' })
@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  // get the loggedin user
  @Get('me')
  findOne(@GetUser() user: User) {
    try {
      return user;
    } catch (error) {
      throw error;
    }
  }

  // update the loggedin user
  @ApiParam({ name: 'id' })
  @Patch(':id')
  update(@GetUser('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }

  // delete the loggedin user
  @ApiParam({ name: 'id' })
  @Delete(':id')
  remove(@GetUser('id') id: string) {
    return this.userService.remove(id);
  }
}
