import { CreateDateColumn, UpdateDateColumn, PrimaryColumn, BeforeInsert } from 'typeorm';
import slugify from 'slugify';
import cryptoRandomString = require('crypto-random-string');
import uuid = require('uuid');

export class BaseEntity {
  @PrimaryColumn('varchar')
  id: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at?: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at?: Date;
}
