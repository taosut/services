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
import { PlaylistCompletion } from './playlistCompletion.entity';
import { PlaylistCompletionService } from './playlistCompletion.service';
import { PlaylistCompletionUpdateDto } from './types/playlistCompletion.types';

@Crud({
  model: {
    type: PlaylistCompletion,
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
@ApiUseTags('Playlist Completion')
@Controller('completion/playlist')
export class PlaylistCompletionController
  implements CrudController<PlaylistCompletion> {
  constructor(public service: PlaylistCompletionService) {}

  get base(): CrudController<PlaylistCompletion> {
    return this;
  }

  @Override()
  async updateOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: PlaylistCompletionUpdateDto
  ): Promise<PlaylistCompletion> {
    return await this.base.updateOneBase(req, dto as PlaylistCompletion);
  }

  @Override()
  async replaceOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: PlaylistCompletionUpdateDto
  ): Promise<PlaylistCompletion> {
    return await this.base.replaceOneBase(req, dto as PlaylistCompletion);
  }
}
