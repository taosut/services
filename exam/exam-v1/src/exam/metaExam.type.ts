import { ApiModelPropertyOptional } from '@nestjs/swagger';

export const exampleResultCondition = {
  condition: '0 <= SCORE <= 50',
  actions: [
    {
      type: 'MESSAGE',
      value: 'Keep on fire',
    },
  ],
};

export class MetaExam {
  @ApiModelPropertyOptional({ example: 'CLASS_ID' })
  class_id?: string;

  @ApiModelPropertyOptional({ example: 'TRACK_ID' })
  track_id?: string;

  @ApiModelPropertyOptional({ example: 'UNIT_ID' })
  unit_id?: string;

  @ApiModelPropertyOptional({ example: [exampleResultCondition] })
  result_conditions?: any;
}
