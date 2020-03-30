import { HttpException } from '@nestjs/common';
import { ApiModelProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import cryptoRandomString from 'crypto-random-string';
import slugify from 'slugify';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  getRepository,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../base-entity';
import { Class } from '../class/class.entity';
import { Unit } from '../unit/unit.entity';

@Entity()
export class Track extends BaseEntity {
  @ApiModelProperty()
  @IsString()
  @Column()
  title: string;

  @ApiModelProperty({ readOnly: true, required: true })
  @Column({ unique: true, update: false })
  slug: string;

  @ApiModelProperty()
  @IsOptional({ always: true })
  @IsString()
  @Column()
  description: string;

  @ApiModelProperty()
  @IsOptional({ always: true })
  @IsNumber()
  @Column({ default: 0, nullable: true })
  duration: number;

  @ApiModelProperty({
    description: 'Use to sort units',
  })
  @IsOptional({ always: true })
  @IsArray()
  @Column({ type: 'simple-array', nullable: true })
  index_units: string[];

  @IsOptional({ always: true })
  @ManyToOne(_ => Class, _ => _.tracks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'class_id' })
  class: Class;

  @Column()
  class_id: string;

  @IsOptional({ always: true })
  @OneToMany(_ => Unit, unit => unit.track)
  @Type(() => Unit)
  units: Unit[];

  @BeforeInsert()
  @BeforeUpdate()
  protected async beforeInsert(): Promise<void> {
    this.slug = slugify(this.title + '-' + cryptoRandomString({ length: 5 }), {
      replacement: '-',
      remove: /[^\w\-]/g,
      lower: true,
    });

    await this.normalize();
  }

  protected async normalize(): Promise<void> {
    const trackRepo = await getRepository(Track);

    const isExist = await trackRepo.findOne({ slug: this.slug });

    if (isExist && isExist.slug !== this.slug) {
      throw new HttpException('Duplicate Slug', 409);
    }

    const classRepo = await getRepository(Class);

    if (this['class.slug']) {
      const classEntity = await classRepo.findOneOrFail({
        slug: this['class.slug'],
      });
      this.class = classEntity;
      this.class_id = classEntity.id;
    }
  }
}
