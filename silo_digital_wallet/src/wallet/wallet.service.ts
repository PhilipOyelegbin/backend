import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { Repository } from 'typeorm';
import { CreateWalletDto, FundWalletDto } from './dto';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
  ) {}

  async createWallet(userId: string, dto: CreateWalletDto) {
    try {
      const existingWallet = await this.walletRepository.findOne({
        where: { currency: dto.currency, user: { id: userId } },
      });
      if (existingWallet)
        throw new BadRequestException(
          'Wallet already exists for this currency',
        );

      const wallet = this.walletRepository.create({
        ...dto,
        user: { id: userId },
      });
      await this.walletRepository.save(wallet);
      return { message: 'Wallet created successfully', wallet };
    } catch (error) {
      throw error;
    }
  }

  async fundWallet(userId: string, dto: FundWalletDto) {
    try {
      const wallet = await this.walletRepository.findOne({
        where: { currency: dto.currency, user: { id: userId } },
      });
      if (!wallet) throw new NotFoundException('Wallet not found');

      if (dto.amount <= 0)
        throw new BadRequestException('Amount must be greater than zero');

      wallet.balance += dto.amount;
      await this.walletRepository.save(wallet);

      return { message: 'Wallet funded successfully', wallet };
    } catch (error) {
      throw error;
    }
  }

  async displayUserWallet(ueerId: string) {
    try {
      const wallet = await this.walletRepository.findOne({
        where: { user: { id: ueerId } },
      });
      if (!wallet) throw new NotFoundException('Wallet not found');

      return { message: 'All wallet found', wallet };
    } catch (error) {
      throw error;
    }
  }

  async filterUserWalletByCurrency(ueerId: string, currency: string) {
    try {
      const wallet = await this.walletRepository.findOne({
        where: { currency, user: { id: ueerId } },
      });
      if (!wallet) throw new NotFoundException('Wallet not found');

      return { message: 'Wallet found', wallet };
    } catch (error) {
      throw error;
    }
  }

  async removeWallet(id: string) {
    try {
      const wallet = await this.walletRepository.findOne({ where: { id } });
      if (!wallet) throw new NotFoundException('Wallet not found');

      // Check if the wallet is empty before deletion
      if (wallet.balance > 0)
        throw new BadRequestException('Wallet must be empty before deletion');

      await this.walletRepository.remove(wallet);
      return { message: 'Wallet deleted successfully' };
    } catch (error) {
      throw error;
    }
  }
}
