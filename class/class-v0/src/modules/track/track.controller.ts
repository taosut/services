import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { Track } from './track.entity';
import { TrackService } from './track.service';

@Crud({
  model: {
    type: Track,
  },
  query: {
    join: {
      class: { eager: true },
    },
  },
  params: {
    classId: {
      field: 'class_id',
      type: 'string',
    },
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
})
@ApiUseTags('Track')
@Controller('class/:classId/track')
@ApiBearerAuth()
export class TrackController {
  constructor(public readonly service: TrackService) {}

  get base(): CrudController<Track> {
    return this;
  }
}
