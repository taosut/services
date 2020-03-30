import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { ContentManagerService } from '../../services/invokes/contentManager.service';
import { Lesson } from './lesson.entity';
import { LessonService } from './lesson.service';

@Crud({
  model: {
    type: Lesson,
  },
  query: {
    join: {
      playlist: { eager: true },
      ebooks: { eager: true },
      audioPlaylists: { eager: true },
    },
  },
  params: {
    playlistSlug: {
      field: 'playlist.slug',
      type: 'string',
    },
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
})
@ApiUseTags('Lesson')
@Controller('playlist/:playlistSlug/lesson')
@ApiBearerAuth()
export class LessonController {
  constructor(
    public readonly service: LessonService,
    public readonly contentManagerService: ContentManagerService
  ) {}

  get base(): CrudController<Lesson> {
    return this;
  }
}
