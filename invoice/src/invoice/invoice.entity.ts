import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity()
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column()
  influencerReferralCodeId: string;

  @Column()
  userId: string;

  @Column()
  productId: string;

  @Column()
  number: string;

  @Column()
  description: string;

  @Column({ default: 0 })
  amount: number;

  @Column({ default: 0 })
  discount: number;

  @Column({ default: 0 })
  tax: number;

  @Column({ default: 0 })
  totalAmount: number;

  @Column()
  status: string;

  @Column({ nullable: true })
  issuedAt: Date;

  @Column({ nullable: true })
  paidAt: Date;

  @Column({ nullable: true })
  reviewedAt: Date;

  @Column({ nullable: true })
  approvedAt: Date;

  @Column({ nullable: true })
  cancelledAt: Date;

  @CreateDateColumn({ nullable: true })
  createdAt?: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt?: Date;

  @Column({ nullable: true })
  timestamp?: Date;
}
