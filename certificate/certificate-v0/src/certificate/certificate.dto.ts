import { ApiModelPropertyOptional } from '@nestjs/swagger';

export class QueryCertificateDto {
  @ApiModelPropertyOptional()
  class_id?: string;

  @ApiModelPropertyOptional()
  user_id?: string;
}
