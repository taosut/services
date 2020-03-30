import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { IPurchase } from './interfaces/purchase.interface';

@Entity()
export class Purchase implements IPurchase {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column()
  membershipType: string;

  @Column()
  membershipAmount: number;

  @Column()
  timePeriod: string;

  @Column()
  periodUnit: string;

  @Column()
  unitPrices: number;

  @Column()
  totalPrices: number;

  @Column()
  receipt: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Column({ nullable: true, type: 'timestamp' })
  paidAt: Date;

  @Column()
  status: string;

  @Column()
  paymentMethod: string;

  @Column({ nullable: true })
  transactionId?: string;

  @Column({ nullable: true })
  transactionTime?: string;

  @Column({ nullable: true })
  vaNumber?: string;

  @Column({ nullable: true })
  billerCode?: string;

  @Column({ nullable: true })
  billerKey?: string;
}
