import {
  Column,
  Entity,
  BeforeInsert,
  BeforeUpdate,
  getRepository,
} from 'typeorm';
import slugify from 'slugify';
import * as cryptoRandomString from 'crypto-random-string';
import uuid = require('uuid');
import { IsOptional, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { CrudValidationGroups } from '@nestjsx/crud';
import { BaseEntity } from './baseEntity';
import { HttpException } from '@nestjs/common';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('tracks')
export class Track extends BaseEntity {
  @ApiModelProperty()
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @MaxLength(200, { always: true })
  @Column({ length: 200 })
  title: string;

  @ApiModelPropertyOptional()
  @IsOptional({ groups: [UPDATE, CREATE] })
  @MaxLength(250, { always: true })
  @Column({ length: 250, unique: true })
  slug: string;

  @ApiModelPropertyOptional({ example: null })
  @IsOptional({ always: true })
  @IsString({ always: true })
  @MaxLength(250, { always: true })
  @Column({ length: 250, type: 'varchar', nullable: true })
  preview: string | null;

  @ApiModelPropertyOptional()
  @IsOptional({ always: true })
  @Column({ type: 'text', nullable: true })
  description: string | null;

  @ApiModelPropertyOptional()
  @IsOptional({ always: true })
  @Column({ type: 'text', nullable: true })
  requirement: string | null;

  @ApiModelPropertyOptional()
  @IsOptional({ always: true })
  @Column({ default: false })
  published: boolean;

  @ApiModelPropertyOptional()
  @IsOptional({ always: true })
  @Column({ type: 'int', nullable: true })
  sort_order: number;

  @ApiModelPropertyOptional({ type: 'string', isArray: true })
  @IsOptional({ always: true })
  @Column({ type: 'simple-array', nullable: true })
  indexLearnings: string[];

  @ApiModelPropertyOptional({type: 'string'})
  @IsOptional({ always: true })
  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;

  @BeforeInsert()
  protected async beforeInsert(): Promise<void> {
    if (!this.slug) {
      this.slug = slugify(this.title + '-' + cryptoRandomString({length: 5}), {
        replacement: '-',
        remove: /[*+~.()'"!:@]/g,
        lower: true,
      });
    }

    this.id = uuid.v4();

    const repository = await getRepository(Track);

    const list = await repository.find({ deleted_at: null });
    this.sort_order = list.length + 1;
  }

  @BeforeUpdate()
  protected async beforeUpdate(): Promise<void> {
    const repository = await getRepository(Track);

    const isExist = await repository.findOne({ slug: this.slug });

    if (isExist && isExist.id !== this.id) {
      throw new HttpException('Duplicate slug', 409);
    }

    this.id = isExist.id;
  }
}
