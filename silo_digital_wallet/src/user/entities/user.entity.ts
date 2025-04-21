import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Wallet } from '../../wallet/entities/wallet.entity';
// import { Transaction } from '../../transaction/entities/transaction.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 250 })
  first_name: string;

  @Column({ length: 250 })
  last_name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone_number: string;

  @Column()
  password: string;

  @Column({ default: false })
  remember_me: boolean;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ nullable: true })
  verification_token: string;

  @Column({ nullable: true })
  verification_token_expiration: string;

  @Column({ nullable: true })
  blacklisted_token: string;

  @OneToMany(() => Wallet, (wallet) => wallet.user)
  wallets: Wallet;

  //   @OneToMany(() => Transaction, (transaction) => transaction.user)
  //   transactions: Transaction;
}
