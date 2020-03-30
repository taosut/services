import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { Learning } from './learning.entity';
import { LearningService } from './learning.service';

@Crud({
  model: {
    type: Learning,
  },
  query: {
    join: {
      playlists: { eager: true },
    },
  },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
})
@ApiUseTags('Learning')
@Controller('learning')
@ApiBearerAuth()
export class LearningController {
  constructor(public readonly service: LearningService) {}

  get base(): CrudController<Learning> {
    return this;
  }

  @Get('/slug/:learningSlug')
  async getOneBySlug(
    @Param('learningSlug') learningSlug: string
  ): Promise<Learning> {
    const response = await this.service.getOneBySlug(learningSlug);

    return response;
  }
}
