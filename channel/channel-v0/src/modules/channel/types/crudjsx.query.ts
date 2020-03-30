import { ApiModelPropertyOptional } from '@nestjs/swagger';

export class QueryParse {
  @ApiModelPropertyOptional()
  page?: number;

  @ApiModelPropertyOptional()
  per_page?: number;
}
