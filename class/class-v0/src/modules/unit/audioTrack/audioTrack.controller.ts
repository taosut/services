import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { AudioTrack } from './audioTrack.entity';
import { AudioTrackService } from './audioTrack.service';
@Crud({
  model: {
    type: AudioTrack,
  },
  query: {
    join: {
      unit: { eager: true },
    },
  },
  params: {
    unitId: {
      field: 'unit_id',
      type: 'string',
    },
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  routes: { exclude: ['createManyBase'] },
})
@ApiUseTags('Audio Track')
@Controller('unit/:unitId/audio-track')
@ApiBearerAuth()
export class AudioTrackController {
  constructor(public readonly service: AudioTrackService) {}

  get base(): CrudController<AudioTrack> {
    return this;
  }
}
