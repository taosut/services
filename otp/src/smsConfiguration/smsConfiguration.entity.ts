import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ISmsConfiguration } from './interfaces/smsConfiguration.interface';

@Entity()
export class SmsConfiguration implements ISmsConfiguration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  accountSid: string;

  @Column({ nullable: true })
  authToken: string;

  @Column({ nullable: true })
  sender: string;

  @Column({ default: false })
  isActive: boolean;
}
