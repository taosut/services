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
  createdAt?: Date;

  @UpdateDateColumn({
    nullable: true,
  })
  updatedAt?: Date;
}
