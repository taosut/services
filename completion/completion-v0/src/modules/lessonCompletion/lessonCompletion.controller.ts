import { Body, Controller, Param, Patch, Post, Put } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import { LessonCompletion } from './lessonCompletion.entity';
import { LessonCompletionService } from './lessonCompletion.service';
import { LessonCompletionUpdateDto } from './types/lessonCompletion';
import {
  NextCompletionDto,
  NextCompletionResponse,
} from './types/nextCompletion';

@Crud({
  model: {
    type: LessonCompletion,
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
@ApiUseTags('Lesson Completion')
@Controller('completion/lesson')
export class LessonCompletionController
  implements CrudController<LessonCompletion> {
  constructor(public service: LessonCompletionService) {}

  get base(): CrudController<LessonCompletion> {
    return this;
  }

  @Post('next')
  async findNextCompletion(
    @Body() dto: NextCompletionDto
  ): Promise<NextCompletionResponse> {
    const response = await this.service.nextCompletion(dto);

    return response;
  }

  @Post('automatic')
  async postAutomatic(
    @Body() dto: LessonCompletion
  ): Promise<LessonCompletion> {
    const response = await this.service.createOneAutomatic(dto);

    return response;
  }

  @Put('automatic/:id')
  async putAutomatic(
    @Param('id') id: string,
    @Body() dto: LessonCompletionUpdateDto
  ): Promise<LessonCompletion> {
    const response = await this.service.replaceOneAutomatic(
      id,
      dto as LessonCompletion
    );

    return response;
  }

  @Patch('automatic/:id')
  async patchAutomatic(
    @Param('id') id: string,
    @Body() dto: LessonCompletionUpdateDto
  ): Promise<LessonCompletion> {
    const response = await this.service.updateOneAutomatic(
      id,
      dto as LessonCompletion
    );

    return response;
  }

  @Override()
  async updateOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: LessonCompletionUpdateDto
  ): Promise<LessonCompletion> {
    return await this.base.updateOneBase(req, dto as LessonCompletion);
  }

  @Override()
  async replaceOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: LessonCompletionUpdateDto
  ): Promise<LessonCompletion> {
    return await this.base.replaceOneBase(req, dto as LessonCompletion);
  }
}
