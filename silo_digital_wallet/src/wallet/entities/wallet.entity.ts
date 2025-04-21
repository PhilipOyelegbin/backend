import { User } from '../../user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.wallets, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User; // Relationship with the user

  @Column()
  currency: string; // e.g., NGN, USD, EUR

  @Column({ type: 'float', default: 0 })
  balance: number; // Wallet balance
}
