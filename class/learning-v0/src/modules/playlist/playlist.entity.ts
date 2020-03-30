import { HttpException } from '@nestjs/common';
import { ApiModelProperty } from '@nestjs/swagger';
import { IsArray, IsInstance, IsOptional } from 'class-validator';
import cryptoRandomString from 'crypto-random-string';
import slugify from 'slugify';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  getRepository,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../base-entity';
import { LearningDto } from '../learning/learning.dto';
import { Learning } from '../learning/learning.entity';
import { Lesson } from '../lesson/lesson.entity';

@Entity()
export class Playlist extends BaseEntity {
  @ApiModelProperty()
  @Column()
  title: string;

  @ApiModelProperty({ readOnly: true, uniqueItems: true })
  @Column({ unique: true, update: false })
  slug: string;

  @IsOptional()
  @ApiModelProperty()
  @Column()
  description: string;

  @IsOptional()
  @ApiModelProperty()
  @Column({ default: 0, nullable: true })
  duration: number;

  @IsOptional()
  @IsArray()
  @ApiModelProperty({
    description: 'Use to sort lessons',
  })
  @Column({ type: 'simple-array', nullable: true })
  indexLessons: string[];

  @IsOptional()
  @IsInstance(LearningDto)
  @ManyToOne(_ => Learning, learning => learning.playlists, {
    onDelete: 'CASCADE',
  })
  learning: Learning;

  @Column()
  learningId: string;

  @IsOptional()
  @OneToMany(_ => Lesson, lesson => lesson.playlist, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  lessons: Lesson[];

  @BeforeInsert()
  protected async beforeInsert(): Promise<void> {
    this.slug = slugify(this.title + '-' + cryptoRandomString({ length: 5 }), {
      replacement: '-',
      remove: /[^\w\-]/g,
      lower: true,
    });

    await this.normalize();
  }

  @BeforeUpdate()
  protected async normalize(): Promise<void> {
    const learningRepo = await getRepository(Learning);

    const isExist = await learningRepo.findOne({ slug: this.slug });

    if (isExist && isExist.slug !== this.slug) {
      throw new HttpException('Duplicate Code', 409);
    }

    if (this['learning.slug']) {
      const learning = await learningRepo.findOneOrFail({
        slug: this['learning.slug'],
      });
      this.learning = learning;
      this.learningId = learning.id;
    }
  }
}
