import { Controller } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import { LearningCompletion } from './learningCompletion.entity';
import { LearningCompletionService } from './learningCompletion.service';
import { LearningCompletionUpdateDto } from './types/learningCompletion.types';

@Crud({
  model: {
    type: LearningCompletion,
  },
  params: {
    id: {
      field: 'id',
      type: 'string',
      primary: true,
    },
  },
  query: {},
})
@ApiUseTags('Learning Completion')
@Controller('completion/learning')
export class LearningCompletionController
  implements CrudController<LearningCompletion> {
  constructor(public service: LearningCompletionService) {}

  get base(): CrudController<LearningCompletion> {
    return this;
  }

  @Override()
  async updateOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: LearningCompletionUpdateDto
  ): Promise<LearningCompletion> {
    return await this.base.updateOneBase(req, dto as LearningCompletion);
  }

  @Override()
  async replaceOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: LearningCompletionUpdateDto
  ): Promise<LearningCompletion> {
    return await this.base.replaceOneBase(req, dto as LearningCompletion);
  }
}
