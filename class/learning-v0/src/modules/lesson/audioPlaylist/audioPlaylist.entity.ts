import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
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
export class AudioPlaylist extends BaseEntity {
  @IsString()
  @ApiModelProperty()
  @Column()
  title: string;

  @IsString()
  @Column()
  time: string;

  @IsString()
  @ApiModelProperty()
  @Column()
  minute: string;

  @IsString()
  @ApiModelProperty()
  @Column()
  second: string;

  @ManyToOne(_ => Lesson, lesson => lesson.audioPlaylists, {
    onDelete: 'CASCADE',
  })
  lesson: Lesson;

  @IsString()
  @Column()
  lessonId: string;

  @BeforeInsert()
  @BeforeUpdate()
  protected async normalize(): Promise<void> {
    if (this.second.length < 2) {
      this.second = `0${this.second}`;
    }
    if (this.minute.length < 2) {
      this.minute = `0${this.minute}`;
    }
    this.time = `${this.minute}:${this.second}`;
    const lessonRepo = await getRepository(Lesson);

    const lesson = await lessonRepo.findOneOrFail({
      slug: this['lesson.slug'],
    });

    this.lesson = lesson;
    this.lessonId = lesson.id;
  }
}
