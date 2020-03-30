import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ISmsOtp } from './interfaces/smsOtp.interface';

@Entity()
export class SmsOtp implements ISmsOtp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  phoneNumber: string;

  @Column()
  otp: string;

  @Column({ nullable: true })
  invalid: number;
}
