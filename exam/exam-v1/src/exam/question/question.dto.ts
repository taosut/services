import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { AnswerDto } from './answer/answer.dto';
import { QuestionType } from './questionType.enum';

export class QuestionDto {
  @ApiModelProperty({ required: false })
  id?: string;

  @ApiModelProperty({ required: true })
  question: string;
  @ApiModelPropertyOptional({
    description:
      'Available Types : [ ' + Object.values(QuestionType).join(',') + ' ]',
    example: QuestionType.MULTIPLE_CHOICE,
  })
  type?: string | null;

  @ApiModelProperty({
    required: true,
    type: 'string',
    description: 'Strings must be uuid and uuid is available in questions',
  })
  exam_id: string;

  @ApiModelProperty({
    required: true,
    type: 'array',
    isArray: true,
    example: [{ answer: 'Choice A', correct: true, score: null }],
  })
  answers: AnswerDto[];
}

export class ManyQuestionWithAnswerDto {
  @ApiModelProperty({ required: false })
  id?: string;
  @ApiModelProperty({ required: true })
  question: string;
  @ApiModelPropertyOptional({
    description:
      'Available Types : [ ' + Object.values(QuestionType).join(',') + ' ]',
    example: QuestionType.MULTIPLE_CHOICE,
  })
  type?: string | null;
  @ApiModelProperty({
    required: true,
    type: 'string',
    description: 'Strings must be uuid and uuid is available in questions',
  })
  exam_id: string;
  @ApiModelProperty({
    description: `Fill column CORRECT if question type is ${QuestionType.MULTIPLE_CHOICE} or ${QuestionType.MULTIPLE_SELECTION_ANSWER}. Fill column SCORE if question type is ${QuestionType.SCORING}`,
    required: true,
    type: 'array',
    isArray: true,
    example: [{ answer: 'Choice A', correct: true, score: null }],
  })
  answers: AnswerDto[];
}

export class CreateManyQuestionWithAnswerDto {
  @ApiModelProperty({
    required: true,
    example: [
      {
        question: 'Question',
        exam_id: 'EXAM_ID',
        type: QuestionType.MULTIPLE_CHOICE,
        answers: [
          {
            answer: 'Choice A',
            correct: true,
            score: null,
          },
          {
            answer: 'Choice B',
            correct: false,
            score: null,
          },
        ],
      },
    ],
  })
  bulk: ManyQuestionWithAnswerDto[];
}

export class QuestionUpdateDto extends QuestionDto {
  @ApiModelProperty({ required: false })
  id: string;
  @ApiModelProperty({ required: true })
  question: string;
  @ApiModelProperty({
    required: true,
    type: 'array',
    isArray: true,
    example: [{ answer: 'Choice A', correct: true }],
  })
  answers: AnswerDto[];
}
