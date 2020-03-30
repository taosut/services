import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import slugify from 'slugify';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { Account } from './account/account.entity';
import { MetaDto } from './types/meta.dto';

@Entity()
export class Channel extends BaseEntity {
  @ApiModelProperty({ readOnly: true })
  @IsOptional()
  @IsString()
  @Column({ unique: true })
  slug: string;

  @ApiModelProperty()
  @IsString()
  @Column({ length: 200, unique: true })
  name: string;

  @ApiModelPropertyOptional()
  @IsString()
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiModelPropertyOptional()
  @IsString()
  @Column({ type: 'text', nullable: true })
  short_description: string;

  @ApiModelPropertyOptional()
  @Column({ type: 'json', nullable: true })
  @Type(() => MetaDto)
  meta: MetaDto;

  @ApiModelPropertyOptional()
  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  logo: string;

  @OneToMany(_ => Account, account => account.channel)
  @Type(() => Account)
  accounts: Account[];

  @BeforeInsert()
  @BeforeUpdate()
  protected async normalize(): Promise<void> {
    this.slug = slugify(this.name.toLowerCase(), {
      replacement: '-',
      lower: true,
    });
  }
}
