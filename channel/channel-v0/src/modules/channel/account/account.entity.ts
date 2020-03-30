import { IsOptional } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../base.entity';
import { Channel } from '../channel.entity';

@Entity()
export class Account extends BaseEntity {
  @Column()
  account_id: string;

  @Column()
  channel_id: string;

  @IsOptional({ always: true })
  @ManyToOne(_ => Channel, _ => _.accounts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'channel_id' })
  channel: Channel;
}
