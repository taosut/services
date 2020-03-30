import { Injectable } from '@nestjs/common';
import { ApiModelPropertyOptional } from '@nestjs/swagger';

@Injectable()
export class QueryDto {
  @ApiModelPropertyOptional({ example: 'Example: ?sort=name,ASC' })
  sort?: string;

  @ApiModelPropertyOptional({ example: 'Example: ?per_page=2' })
  per_page?: number;

  @ApiModelPropertyOptional({ example: 'Example: ?page=2' })
  page?: number;
}
