import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

export class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string = uuid();

  @CreateDateColumn({ nullable: true })
  created_at?: Date;

  @UpdateDateColumn({
    nullable: true,
  })
  updated_at?: Date;
}
