import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { BeforeInsert, Column, Entity } from 'typeorm';
import uuid = require('uuid');
import { BaseEntity } from './baseEntity';

@Entity('profiles')
export class Profile extends BaseEntity {
  @ApiModelPropertyOptional({ example: 'ACCOUNT_ID' })
  @IsOptional({ always: true })
  @Column({ unique: true, nullable: true })
  account_id?: string | null;

  @ApiModelPropertyOptional()
  @IsOptional({ always: true })
  @Column({ nullable: true })
  group?: string | null;

  @ApiModelPropertyOptional()
  @IsOptional({ always: true })
  @Column({ nullable: true })
  position?: string | null;

  @ApiModelPropertyOptional()
  @IsOptional({ always: true })
  @Column({ type: 'text', nullable: true })
  address?: string | null;

  @ApiModelPropertyOptional()
  @IsOptional({ always: true })
  @Column({ nullable: true })
  province?: string | null;

  @ApiModelPropertyOptional()
  @IsOptional({ always: true })
  @Column({ nullable: true })
  city?: string | null;

  @ApiModelPropertyOptional()
  @IsOptional({ always: true })
  @Column({ nullable: true })
  sub_district?: string | null;

  @ApiModelPropertyOptional()
  @IsOptional({ always: true })
  @Column({ nullable: true })
  education?: string | null;

  @ApiModelPropertyOptional()
  @IsOptional({ always: true })
  @Column({ nullable: true })
  phone_number?: string | null;

  @ApiModelPropertyOptional()
  @IsOptional({ always: true })
  @Column({ nullable: true })
  photo_id?: string | null;

  @BeforeInsert()
  protected beforeInsert(): void {
    if (this.account_id) {
      this.id = this.account_id;
    } else if (!this.id) {
      this.id = uuid.v4();
    }
  }
}
