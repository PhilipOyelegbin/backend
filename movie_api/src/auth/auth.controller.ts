import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiBadRequestResponse({ description: 'Credentials taken' })
@ApiUnauthorizedResponse({ description: 'Invalid credentials' })
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCreatedResponse({ description: 'User created' })
  @Post('signup')
  register(@Body() dto: SignUpDto) {
    return this.authService.register(dto);
  }

  @ApiOkResponse({ description: 'User authenticated' })
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  login(@Body() dto: SignInDto) {
    return this.authService.login(dto);
  }

  @ApiOkResponse({ description: 'User authenticated' })
  @HttpCode(HttpStatus.OK)
  @Post('host')
  admin(@Body() dto: SignInDto) {
    return this.authService.admin(dto);
  }
}
