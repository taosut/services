import { Controller, Get, Post, Body, Param,
  NotFoundException } from '@nestjs/common';
import { ApiImplicitParam, ApiImplicitQuery, ApiUseTags } from '@nestjs/swagger';
import { PlaylistCompletionService } from '../../providers/playlistcompletion/playlistcompletion.service';
import { convertResponse, convertDate } from '../_plugins/converter';
import { slugify } from '../_plugins/slugify';
import { PlaylistService } from '../../providers/playlist/playlist.service';
import * as validate from 'uuid-validate';
import { AuthService } from '../../_handler/auth/auth.service';

@ApiUseTags('Completion')
@Controller('playlist')
export class PlaylistCompletionController {
  private readonly authService: AuthService;
  constructor(private readonly playlistCompletionService: PlaylistCompletionService,
              private readonly playlistService: PlaylistService) {}

  @Get(':slug/completion')
  @ApiImplicitParam({ name: 'slug', description: 'Slug can replace with id. Example : the-title or 049ddb16-9f0f-41a2-90e6-39b8768c8184' })
  async findOne(@Param('slug') slug): Promise<object> {
    const userId = await this.authService.getUserId('learner');
    let playlist;
    if (validate(slug)) {
      playlist = await this.playlistService.findOne({id: slug});

      if (!playlist) {
        throw new NotFoundException('Playlist is not Found');
      }
    } else {
      playlist = await this.playlistService.findOne({slug});

      if (!playlist) {
        throw new NotFoundException('Playlist is not Found');
      }
    }

    // Get Playlist Completion
    let result;
    result = await this.playlistCompletionService.findOne({playlist_id: playlist.id, user_id: userId});

    if (!result) {
      throw new NotFoundException('Playlist Completion is not found');
    }

    result = convertDate(result);
    return convertResponse(result);
  }
}
