import { ApiModelProperty } from '@nestjs/swagger';
import { CrudValidationGroups } from '@nestjsx/crud';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import { BeforeInsert, Column, Entity } from 'typeorm';
import uuid = require('uuid');
import { BaseEntity } from './baseEntity';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('subscriptions')
export class Subscription extends BaseEntity {
  @ApiModelProperty({ example: 'ACCOUNT_ID' })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @Column()
  account_id: string;

  @ApiModelProperty({ example: 'PAYMENT_ID' })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @Column()
  payment_id: string;

  @ApiModelProperty({ example: new Date() })
  @IsOptional({ always: true })
  @Column()
  start?: Date;

  @ApiModelProperty({ example: new Date() })
  @IsOptional({ always: true })
  @Column()
  expired?: Date;

  @ApiModelProperty({ example: false })
  @IsOptional({ always: true })
  @IsBoolean({ always: true })
  @Column({ default: false })
  active: boolean;

  @BeforeInsert()
  protected beforeInsert(): void {
    this.id = uuid.v4();
  }
}
