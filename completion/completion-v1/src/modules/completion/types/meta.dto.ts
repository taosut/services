import { ApiModelProperty } from '@nestjs/swagger';

export class MetaCompletionDto {
  @ApiModelProperty()
  attempts: MetaAttemptDto[];
}

export class MetaAttemptDto {
  @ApiModelProperty()
  exam_id: string;

  @ApiModelProperty()
  finished: boolean;

  @ApiModelProperty()
  score: string | null;

  @ApiModelProperty()
  total_correct?: number | null;

  @ApiModelProperty()
  total_question?: number | null;

  @ApiModelProperty()
  created_at?: Date;

  @ApiModelProperty()
  updated_at?: Date;

  @ApiModelProperty()
  attempt_details: MetaAttemptDetailDto[];
}

export class MetaAttemptDetailDto {
  @ApiModelProperty()
  question: any;

  @ApiModelProperty()
  choosen_answer_ids: string[];

  @ApiModelProperty()
  correct_answer_ids: string[];

  @ApiModelProperty()
  sort_order: number;
}
