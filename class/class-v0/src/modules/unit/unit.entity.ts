import { HttpException } from '@nestjs/common';
import { ApiModelProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInstance, IsOptional, IsString } from 'class-validator';
import cryptoRandomString = require('crypto-random-string');
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
import { Track } from '../track/track.entity';
import { TrackDto } from '../track/types/track.dto';
import { AudioTrack } from './audioTrack/audioTrack.entity';
import { Ebook } from './ebook/ebook.entity';
import { EUnitType } from './types/unit.const';

@Entity()
export class Unit extends BaseEntity {
  @ApiModelProperty()
  @IsString()
  @Column()
  title: string;

  @ApiModelProperty({ readOnly: true })
  @Column({ unique: true, update: false })
  slug: string;

  @ApiModelProperty({
    description: `Available type [${EUnitType.video}, ${EUnitType.audio}, ${EUnitType.ebook}, ${EUnitType.exam}]`,
  })
  @IsString()
  @Column()
  type: EUnitType;

  @ApiModelProperty()
  @IsOptional({ always: true })
  @IsString()
  @Column({ nullable: true, type: 'text' })
  description: string;

  // @ApiModelProperty()
  // @IsOptional({ always: true })
  // @IsString()
  // @Column({ nullable: true })
  // exam_id: string;

  @ApiModelProperty()
  @IsOptional({ always: true })
  @IsString()
  @Column({ nullable: true })
  content_id: string;

  @ApiModelProperty()
  @IsOptional({ always: true })
  @IsArray()
  @Column({ type: 'simple-array', nullable: true })
  content_ids: string[];

  @Column()
  track_id: string;

  @IsOptional({ always: true })
  @IsInstance(TrackDto)
  @ManyToOne(_ => Track, track => track.units, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'track_id' })
  track: Track;

  @OneToMany(_ => Ebook, ebook => ebook.unit, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @Type(() => Ebook)
  ebooks: Ebook[];

  @OneToMany(_ => AudioTrack, audioTrack => audioTrack.unit, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @Type(() => AudioTrack)
  audio_tracks: AudioTrack[];

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
    const unitRepo = await getRepository(Unit);

    const isExist = await unitRepo.findOne({ slug: this.slug });

    if (isExist && isExist.slug !== this.slug) {
      throw new HttpException('Duplicate Slug', 409);
    }

    const trackRepo = await getRepository(Track);

    if (this['class.slug']) {
      const trackEntity = await trackRepo.findOneOrFail({
        slug: this['class.slug'],
      });
      this.track = trackEntity;
      this.track_id = trackEntity.id;
    }
  }
}
