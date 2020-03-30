import { HttpException } from '@nestjs/common';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import cryptoRandomString from 'crypto-random-string';
import slugify from 'slugify';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  getRepository,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../base-entity';
import { Track } from '../track/track.entity';
import { EClassType } from './types/class.enum';
import { MetaDto } from './types/meta.dto';

@Entity()
export class Class extends BaseEntity {
  @ApiModelProperty({ required: true })
  @Column()
  title: string;

  @ApiModelProperty({ readOnly: true, required: true })
  @Column({ unique: true, update: false })
  slug: string;

  @ApiModelPropertyOptional()
  @IsOptional({ always: true })
  @IsString()
  @Column({ nullable: true, type: 'text' })
  description: string;

  @ApiModelProperty()
  @IsOptional({ always: true })
  @IsString()
  @Column({ nullable: true, type: 'text' })
  term_and_condition: string;

  @ApiModelProperty()
  @IsOptional({ always: true })
  @IsBoolean()
  @Column({ default: false })
  published: boolean;

  @ApiModelProperty()
  @IsOptional({ always: true })
  @IsBoolean()
  @Column({ default: false })
  approved: boolean;

  @ApiModelProperty()
  @IsOptional({ always: true })
  @IsBoolean()
  @Column({ default: false })
  premium: boolean;

  @ApiModelProperty()
  @IsOptional({ always: true })
  @IsBoolean()
  @Column({ default: false })
  featured: boolean;

  @ApiModelProperty()
  @IsOptional({ always: true })
  @IsString()
  @Column({ nullable: true })
  featured_file_id: string;

  @ApiModelProperty()
  @IsOptional({ always: true })
  @IsString()
  @Column({ nullable: true })
  preview_file_id: string;

  @ApiModelProperty({ required: true })
  @Column()
  user_id: string;

  @ApiModelProperty()
  @IsOptional({ always: true })
  @IsString()
  @Column({ nullable: true })
  publisher_id: string;

  @ApiModelProperty()
  @IsOptional({ always: true })
  @IsNumber()
  @Column({ default: 0 })
  enrolled: number;

  @ApiModelProperty()
  @Column({
    default: EClassType.course,
  })
  type: EClassType;

  @ApiModelProperty()
  @IsOptional({ always: true })
  @IsString()
  @Column({ nullable: true })
  length: string;

  @ApiModelProperty()
  @IsOptional({ always: true })
  @IsString()
  @Column({ nullable: true })
  effort: string;

  @ApiModelPropertyOptional()
  @IsOptional({ always: true })
  @Column({ type: 'json', nullable: true })
  @Type(() => MetaDto)
  meta: MetaDto;

  @ApiModelProperty({
    description: 'Use to sort tracks',
    nullable: true,
  })
  @IsOptional({ always: true })
  @IsArray()
  @Column({ type: 'simple-array', nullable: true })
  index_tracks: string[];

  @ApiModelProperty({
    nullable: true,
  })
  @IsOptional({ always: true })
  @IsArray()
  @Column({ type: 'simple-array', nullable: true })
  syllabus: string[];

  @OneToMany(_ => Track, track => track.class)
  @Type(() => Track)
  tracks: Track[];

  @BeforeInsert()
  @BeforeUpdate()
  protected async normalize(): Promise<void> {
    this.slug = slugify(this.title + '-' + cryptoRandomString({ length: 5 }), {
      replacement: '-',
      remove: /[^\w\-]/g,
      lower: true,
    });

    const classRepo = await getRepository(Class);

    const isExist = await classRepo.findOne({ slug: this.slug });

    if (isExist && isExist.slug !== this.slug) {
      throw new HttpException('Duplicate Slug', 409);
    }
  }
}
