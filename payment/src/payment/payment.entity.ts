import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import {
  EBankType,
  EPaymentMethod,
  EPaymentStatus,
  EStoreName,
} from './interfaces/payment.enum';
import { IPayment } from './interfaces/payment.interface';

@Entity()
export class Payment implements IPayment {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column()
  invoiceId: string;

  @Column()
  paymentNumber: string;

  @Column()
  userId: string;

  @Column()
  paymentAmount: number;

  @Column()
  paymentMethod: EPaymentMethod;

  @Column({ nullable: true })
  bankTransferType?: EBankType;

  @Column({ nullable: true })
  transactionDocument?: string;

  @Column({ nullable: true })
  gopayCallbackUrl?: string;

  @Column({ nullable: true, unique: true })
  midtransTransactionId: string;

  @Column({ nullable: true })
  midtransTransactionTime: string;

  @Column({ nullable: true })
  midtransStatus: string;

  @Column()
  status: EPaymentStatus;

  @Column({ nullable: true })
  vaNumber?: string;

  @Column({ nullable: true })
  billerCode?: string;

  @Column({ nullable: true })
  billKey?: string;

  @Column({ nullable: true })
  gopayAction: string;

  @Column({ nullable: true })
  storeName?: EStoreName;

  @Column({ nullable: true })
  message?: string;

  @Column({ nullable: true })
  cStorePaymentCode?: string;

  @Column({ nullable: true })
  grossAmount?: string;

  @Column({ nullable: true })
  statusUpdatedAt?: Date;

  @Column()
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt: Date;

  @BeforeInsert()
  protected beforeInsert(): void {
    this.createdAt = new Date();
  }

  @BeforeUpdate()
  protected beforeUpdate(): void {
    this.updatedAt = new Date();
  }
}
