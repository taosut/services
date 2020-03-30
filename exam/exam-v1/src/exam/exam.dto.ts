import { ApiModelPropertyOptional } from '@nestjs/swagger';

export class QueryExternalJoin {
  @ApiModelPropertyOptional()
  external_join?: string;
}
