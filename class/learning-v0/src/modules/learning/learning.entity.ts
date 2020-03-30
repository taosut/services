import { HttpException } from '@nestjs/common';
import { ApiModelProperty } from '@nestjs/swagger';
import { IsArray, IsOptional } from 'class-validator';
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
import { Playlist } from '../playlist/playlist.entity';
import { ELearningType } from './learning.const';

@Entity()
export class Learning extends BaseEntity {
  @ApiModelProperty()
  @Column()
  title: string;

  @ApiModelProperty({ readOnly: true })
  @Column({ unique: true, update: false })
  slug: string;

  @IsOptional()
  @ApiModelProperty()
  @Column({ nullable: true, type: 'text' })
  description: string;

  @IsOptional()
  @ApiModelProperty()
  @Column({ nullable: true, type: 'text' })
  termAndCondition: string;

  @ApiModelProperty()
  @Column({ default: false })
  published: boolean;

  @ApiModelProperty()
  @Column({ default: false })
  approved: boolean;

  @ApiModelProperty()
  @Column({ default: false })
  premium: boolean;

  @ApiModelProperty()
  @Column({ default: false })
  featured: boolean;

  @ApiModelProperty()
  @Column({ nullable: true })
  featuredFileId: string;

  @ApiModelProperty()
  @Column({ nullable: true })
  previewFileId: string;

  @ApiModelProperty()
  @Column({ nullable: true })
  userId: string;

  @ApiModelProperty()
  @Column({ nullable: true })
  trackId: string;

  @ApiModelProperty()
  @Column({ nullable: true })
  subCategoryId: string;

  @ApiModelProperty()
  @Column({ nullable: true })
  publisherId: string;

  @ApiModelProperty()
  @Column({ default: 0 })
  enrolledNumber: number;

  @ApiModelProperty({
    description: `Available type [${ELearningType.course}, ${ELearningType.video}, ${ELearningType.audio}, ${ELearningType.ebook}]`,
  })
  @Column({ default: ELearningType.course })
  type: ELearningType;

  @ApiModelProperty()
  @Column({ nullable: true })
  length: string;

  @ApiModelProperty()
  @Column({ nullable: true })
  effort: string;

  @IsOptional()
  @IsArray()
  @ApiModelProperty({
    description: 'Use to sort playlists',
    example: ['idPlaylist1', 'idPlaylist2', 'idPlaylist3'],
    nullable: true,
  })
  @Column({ type: 'simple-array', nullable: true })
  indexPlaylists: string[];

  @IsOptional()
  @IsArray()
  @ApiModelProperty({
    nullable: true,
  })
  @Column({ type: 'simple-array', nullable: true })
  syllabus: string[];

  @OneToMany(_ => Playlist, playlist => playlist.learning, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  playlists: Playlist[];

  @BeforeInsert()
  @BeforeUpdate()
  protected async normalize(): Promise<void> {
    this.slug = slugify(this.title + '-' + cryptoRandomString({ length: 5 }), {
      replacement: '-',
      remove: /[^\w\-]/g,
      lower: true,
    });

    const learningRepo = await getRepository(Learning);

    const isExist = await learningRepo.findOne({ slug: this.slug });

    if (isExist && isExist.slug !== this.slug) {
      throw new HttpException('Duplicate Code', 409);
    }
  }
}
