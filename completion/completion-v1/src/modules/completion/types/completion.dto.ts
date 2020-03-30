import { ApiModelProperty } from '@nestjs/swagger';

export class GenerateCompletionDto {
  @ApiModelProperty()
  readonly user_id: string;

  @ApiModelProperty()
  readonly class_id: string;
}
