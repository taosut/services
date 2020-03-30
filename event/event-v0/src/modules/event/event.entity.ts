import { ApiModelProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base-entity';

@Entity()
export class Event extends BaseEntity {
  @ApiModelProperty({ required: true, type: 'string', format: 'date-time' })
  @IsDate()
  @Column({
    nullable: true,
  })
  start_at: Date;

  @ApiModelProperty({ required: true, type: 'string', format: 'date-time' })
  @IsDate()
  @Column({
    nullable: true,
  })
  end_at: Date;

  @ApiModelProperty({
    required: true,
    type: 'string',
    description: 'Event title',
  })
  @IsString()
  @Column({ type: 'text' })
  title: string;

  @IsString()
  @ApiModelProperty({
    required: true,
    type: 'string',
    description: 'Event description',
  })
  @Column({ type: 'text' })
  description: string;

  @IsBoolean()
  @ApiModelProperty({ required: true, type: 'boolean' })
  @Column({ default: false })
  published: boolean;

  @ApiModelProperty({
    required: false,
    type: 'string',
    description: 'Strings must be uuid',
    example: '53557f1a-2e0c-4b5a-b43f-bb17ad6617f5',
  })
  @IsNotEmpty()
  @Column({ type: 'varchar' })
  user_id: string;
}
