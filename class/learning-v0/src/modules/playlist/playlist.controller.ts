import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { Playlist } from './playlist.entity';
import { PlaylistService } from './playlist.service';

@Crud({
  model: {
    type: Playlist,
  },
  query: {
    join: { learning: { eager: true }, lessons: { eager: true } },
  },
  params: {
    learningSlug: {
      field: 'learning.slug',
      type: 'string',
    },
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
})
@ApiUseTags('Playlist')
@Controller('learning/:learningSlug/playlist')
@ApiBearerAuth()
export class PlaylistController {
  constructor(public readonly service: PlaylistService) {}

  get base(): CrudController<Playlist> {
    return this;
  }
}
