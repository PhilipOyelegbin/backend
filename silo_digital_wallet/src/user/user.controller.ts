import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { UpdatePasswordDto, UpdateUserDto } from './dto';
import {
  ApiAcceptedResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Get user information',
    description: 'Fetches the current user information from the database.',
  })
  @ApiOkResponse({ description: 'Ok' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @Get('me')
  displayUser(@GetUser() user: { id: string }) {
    return this.userService.displayUser(user.id);
  }

  @ApiOperation({
    summary: 'Update user information',
    description: 'Updates the current user information in the database.',
  })
  @ApiAcceptedResponse({ description: 'Accepted' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @HttpCode(HttpStatus.ACCEPTED)
  @Patch('me')
  updateUser(@GetUser() user: { id: string }, @Body() dto: UpdateUserDto) {
    return this.userService.updateUser(user.id, dto);
  }

  @ApiOperation({
    summary: 'Update user password',
    description: 'Updates the current user password in the database.',
  })
  @ApiAcceptedResponse({ description: 'Accepted' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @HttpCode(HttpStatus.ACCEPTED)
  @Patch('me/password')
  updateUserPassword(
    @GetUser() user: { id: string },
    @Body() dto: UpdatePasswordDto,
  ) {
    return this.userService.updateUserPassword(user.id, dto);
  }

  @ApiOperation({
    summary: 'Delete user account',
    description: 'Deletes the current user account from the database.',
  })
  @ApiNoContentResponse({ description: 'No content' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('me')
  removeUser(@GetUser() user: { id: string }) {
    return this.userService.removeUser(user.id);
  }
}
