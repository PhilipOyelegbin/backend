import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto, FundWalletDto } from './dto';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@UseGuards(AuthGuard('jwt'))
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @ApiOperation({
    summary: 'Create a new wallet',
    description: 'Creates a new wallet for the authenticated user.',
  })
  @ApiCreatedResponse({ description: 'Created' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @Post()
  createWallet(@GetUser() user: { id: string }, @Body() dto: CreateWalletDto) {
    return this.walletService.createWallet(user.id, dto);
  }

  @ApiOperation({
    summary: 'Fund an existing wallet',
    description: 'Funds an existing wallet for the authenticated user.',
  })
  @ApiOkResponse({ description: 'Ok' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @Post('fund')
  fundWallet(@GetUser() user: { id: string }, @Body() dto: FundWalletDto) {
    return this.walletService.fundWallet(user.id, dto);
  }

  @ApiOperation({
    summary: 'Display user wallets',
    description: 'Displays the wallets of the authenticated user.',
  })
  @ApiOkResponse({ description: 'Ok' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @Get()
  displayUserWallet(@GetUser() user: { id: string }) {
    return this.walletService.displayUserWallet(user.id);
  }

  @ApiOperation({
    summary: 'Filter user wallet by currency',
    description: 'Filters the wallet of the authenticated user by currency.',
  })
  @ApiOkResponse({ description: 'Ok' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @Get(':currency')
  filterUserWalletByCurrency(
    @GetUser() user: { id: string },
    @Param('currency') currency: string,
  ) {
    return this.walletService.filterUserWalletByCurrency(user.id, currency);
  }

  @ApiOperation({
    summary: 'Delete a wallet',
    description: 'Deletes a wallet for the authenticated user.',
  })
  @ApiNoContentResponse({ description: 'No content' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  removeWallet(@Param('id') id: string) {
    return this.walletService.removeWallet(id);
  }
}
