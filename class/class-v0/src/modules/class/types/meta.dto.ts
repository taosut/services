import { Injectable } from '@nestjs/common';
import { ApiModelProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

const categoriesSample: CategoryDto[] = [
  {
    category: 'Category Name 1',
    sub_categories: ['Sub Category 1', 'Sub Category 2'],
  },
  {
    category: 'Category Name 2',
    sub_categories: ['Sub Category 1', 'Sub Category 2'],
  },
];

@Injectable()
export class CategoryDto {
  @ApiModelProperty()
  @IsString()
  category: string;

  @ApiModelProperty({
    nullable: true,
  })
  @IsOptional({ always: true })
  @IsArray()
  sub_categories: string[];
}

@Injectable()
export class MetaDto {
  @ApiModelProperty({
    nullable: true,
    example: categoriesSample,
  })
  @IsOptional({ always: true })
  @IsArray()
  categories: CategoryDto[];

  @ApiModelProperty({
    nullable: true,
  })
  @IsOptional({ always: true })
  @IsArray()
  series: string[];
}
