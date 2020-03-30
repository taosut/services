import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiModelProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
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
import { SubCategory } from '../subCategory/subCategory.entity';

@Entity()
export class Category extends BaseEntity {
  @Column({ unique: true })
  slug: string;

  @ApiModelProperty({ required: true })
  @IsString()
  @Column({ length: 200, unique: true })
  name: string;

  @ApiModelProperty()
  @IsOptional({ always: true })
  @IsString()
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiModelProperty()
  @IsOptional({ always: true })
  @IsString()
  @Column({ nullable: true })
  previewFileId: string;

  @OneToMany(_ => SubCategory, _ => _.category, {
    nullable: true,
  })
  subCategories: SubCategory[];

  @BeforeInsert()
  @BeforeUpdate()
  protected async normalize(): Promise<void> {
    this.slug = slugify(this.name.toLowerCase(), {
      replacement: '-',
      remove: /[^\w\-]/g,
      lower: true,
    });

    const categoryRepo = await getRepository(Category);

    const nameExist = await categoryRepo.findOne({ name: this.name });

    if (nameExist && nameExist.id !== this.id) {
      throw new HttpException('Duplicate Name', HttpStatus.CONFLICT);
    }

    const slugExist = await categoryRepo.findOne({ slug: this.slug });

    if (slugExist && slugExist.id !== this.id) {
      throw new HttpException('Duplicate Slug', HttpStatus.CONFLICT);
    }
  }
}
