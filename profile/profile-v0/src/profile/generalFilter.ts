import { ApiModelPropertyOptional } from '@nestjs/swagger';

export class GeneralFilter {
  @ApiModelPropertyOptional()
  fields: string;

  @ApiModelPropertyOptional()
  filter: string;

  @ApiModelPropertyOptional()
  per_page: string;

  @ApiModelPropertyOptional()
  page: string;
}
