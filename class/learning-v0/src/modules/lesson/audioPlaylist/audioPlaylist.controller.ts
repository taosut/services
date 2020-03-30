import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { AudioPlaylist } from './audioPlaylist.entity';
import { AudioPlaylistService } from './audioPlaylist.service';
@Crud({
  model: {
    type: AudioPlaylist,
  },
  query: {
    join: {
      lesson: { eager: true },
    },
  },
  params: {
    lessonSlug: {
      field: 'lesson.slug',
      type: 'string',
    },
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
})
@ApiUseTags('Audio Playlist')
@Controller('lesson/:lessonSlug/audio-playlist')
@ApiBearerAuth()
export class AudioPlaylistController {
  constructor(public readonly service: AudioPlaylistService) {}

  get base(): CrudController<AudioPlaylist> {
    return this;
  }
}
