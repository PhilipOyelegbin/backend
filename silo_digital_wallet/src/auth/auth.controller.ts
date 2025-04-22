import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginAuthDto,
  RegisterAuthDto,
  ResetPasswordDto,
  TokenDto,
} from './dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Register a new user',
    description: 'Creates a new user account in the database.',
  })
  @ApiCreatedResponse({ description: 'Created' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Post('register')
  registerUser(@Body() dto: RegisterAuthDto) {
    return this.authService.registerUser(dto);
  }

  @ApiOperation({
    summary: 'Verify user email',
    description: 'Verify a user email using the token sent to the email.',
  })
  @ApiOkResponse({ description: 'Ok' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @HttpCode(HttpStatus.OK)
  @Post('verify')
  async verifyEmail(@Body() dto: TokenDto) {
    const isVerified = await this.authService.verifyEmail(dto.token);
    if (isVerified) {
      return { message: 'Email successfully verified.' };
    } else {
      throw new BadRequestException('Verification failed or token invalid.');
    }
  }

  @ApiOperation({
    summary: 'Resend verification mail',
    description: 'Resend verification mail to the user.',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['email'],
            properties: {
              email: {
                description: 'Email address',
                type: 'string',
                example: 'dj@gmail.com',
              },
            },
          },
        },
      },
    },
  })
  @ApiOkResponse({ description: 'Ok' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @HttpCode(HttpStatus.OK)
  @Post('resend')
  async resendVerificationEmail(@Body() dto: { email: string }) {
    return this.authService.resendVerificationEmail(dto.email);
  }

  @ApiOperation({
    summary: 'User forgot password',
    description: 'Send reset token to the user for password reset.',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['email'],
            properties: {
              email: {
                description: 'Email address',
                type: 'string',
                example: 'dj@gmail.com',
              },
            },
          },
        },
      },
    },
  })
  @ApiOkResponse({ description: 'Ok' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @HttpCode(HttpStatus.OK)
  @Post('forgot')
  async forgotPassword(@Body() dto: { email: string }) {
    return this.authService.forgotPassword(dto.email);
  }

  @ApiOperation({
    summary: 'Reset user password',
    description: 'Change password using the reset token sent to the email.',
  })
  @ApiOkResponse({ description: 'Ok' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @HttpCode(HttpStatus.OK)
  @Post('reset')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.token, dto.password);
  }

  @ApiOperation({
    summary: 'Login a user',
    description: 'Authenticates a user and returns a JWT token.',
  })
  @ApiOkResponse({ description: 'Ok' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  loginUser(@Body() dto: LoginAuthDto) {
    return this.authService.loginUser(dto);
  }

  @ApiOperation({
    summary: 'Logout a user',
    description: 'User should logout from the application.',
  })
  @ApiOkResponse({ description: 'Ok' })
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logoutUser(@Body() dto: TokenDto) {
    return this.authService.logoutUser(dto.token);
  }
}
