import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  BlacklistTokenDto,
  ResetPassword,
  ResetToken,
  SignInDto,
  SignUpDto,
} from './dto';
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCreatedResponse({ description: 'User created' })
  @ApiBadRequestResponse({ description: 'Credentials taken' })
  @Post('signup')
  register(@Body() dto: SignUpDto) {
    return this.authService.register(dto);
  }

  @ApiOkResponse({ description: 'User authenticated' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  login(@Body() dto: SignInDto) {
    return this.authService.login(dto);
  }

  @ApiOkResponse({ description: 'User authenticated' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @HttpCode(HttpStatus.OK)
  @Post('host')
  admin(@Body() dto: SignInDto) {
    return this.authService.admin(dto);
  }

  @ApiAcceptedResponse({ description: 'Token generated' })
  @HttpCode(HttpStatus.ACCEPTED)
  @Patch('resettoken')
  resetToken(@Body() dto: ResetToken) {
    return this.authService.generateResetToken(dto.email);
  }

  @ApiAcceptedResponse({ description: 'Password reset' })
  @HttpCode(HttpStatus.ACCEPTED)
  @Patch('resetpassword')
  resetPassword(@Body() dto: ResetPassword) {
    return this.authService.resetPassword(dto.resetToken, dto.password);
  }

  @ApiOkResponse({ description: 'Logged out successfully' })
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Body() dto: BlacklistTokenDto) {
    return this.authService.logout(dto);
  }
}
