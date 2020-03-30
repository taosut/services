import { Controller, Get, Post, Body, Param,
  NotFoundException,
  BadRequestException,
  HttpException} from '@nestjs/common';
import { ApiImplicitParam, ApiImplicitQuery, ApiUseTags } from '@nestjs/swagger';
import { TrackCompletionService } from '../../providers/trackcompletion/trackcompletion.service';
import { convertResponse, convertDate } from '../_plugins/converter';
import { slugify } from '../_plugins/slugify';
import { TrackService } from '../../providers/track/track.service';
import * as validate from 'uuid-validate';
import { AuthService } from '../../_handler/auth/auth.service';

@ApiUseTags('Completion')
@Controller('track')
export class TrackCompletionController {
  private readonly authService: AuthService;
  constructor(private readonly trackCompletionService: TrackCompletionService,
              private readonly trackService: TrackService) {
                this.authService = new AuthService();
              }

  @Get(':slug/completion')
  @ApiImplicitParam({ name: 'slug', description: 'Slug can replace with id. Example : the-title or 049ddb16-9f0f-41a2-90e6-39b8768c8184' })
  async findOne(@Param('slug') slug): Promise<object> {
    try {
      const userId = await this.authService.getUserId('learner');
      let track;
      if (validate(slug)) {
        track = await this.trackService.findOne({id: slug});

        if (!track) {
          throw new NotFoundException('Track is not Found');
        }
      } else {
        track = await this.trackService.findOne({slug});

        if (!track) {
          throw new NotFoundException('Track is not Found');
        }
      }

      // Get Track Completion
      let result;
      result = await this.trackCompletionService.findOne({track_id: track.id, user_id: userId});

      if (!result) {
        throw new NotFoundException('Track Completion is not found');
      }

      result = convertDate(result);
      return convertResponse(result);
    } catch (error) {
      if (error.statusCode) {
        throw new HttpException(error.message, error.statusCode);
      } else {
        throw new BadRequestException(error.message);
      }
    }
  }
}
