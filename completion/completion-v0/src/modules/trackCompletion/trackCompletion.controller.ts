import { Controller } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { TrackCompletion } from './trackCompletion.entity';
import { TrackCompletionService } from './trackCompletion.service';

@Crud({
  model: {
    type: TrackCompletion,
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
@ApiUseTags('Track Completion')
@Controller('completion/track')
export class TrackCompletionController
  implements CrudController<TrackCompletion> {
  constructor(public service: TrackCompletionService) {}

  get base(): CrudController<TrackCompletion> {
    return this;
  }
}
