import { ApiModelProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  getRepository,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from '../../base-entity';
import { Lesson } from '../lesson.entity';

@Entity()
export class Ebook extends BaseEntity {
  @IsString()
  @ApiModelProperty()
  @Column()
  title: string;

  @IsString()
  @ApiModelProperty()
  @Column({ type: 'longtext' })
  content: string;

  @IsNumber()
  @ApiModelProperty()
  @Column()
  pageNumber: number;

  @ManyToOne(_ => Lesson, lesson => lesson.ebooks, {
    onDelete: 'CASCADE',
  })
  lesson: Lesson;

  @IsString()
  @Column()
  lessonId: string;

  @BeforeInsert()
  @BeforeUpdate()
  protected async normalize(): Promise<void> {
    const lessonRepo = await getRepository(Lesson);

    const lesson = await lessonRepo.findOneOrFail({
      slug: this['lesson.slug'],
    });

    this.lesson = lesson;
    this.lessonId = lesson.id;
  }
}
