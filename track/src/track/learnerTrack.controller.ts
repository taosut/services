import {
  Controller, HttpException, HttpCode, Get,
} from '@nestjs/common';
import {
  ApiUseTags, ApiOperation,
} from '@nestjs/swagger';
import { TrackService } from './track.service';

@ApiUseTags('[Learner] Track')
@Controller('learner/tracks')
// @UseGuards(TrackGuard)
// @Roles(DefaultRoles.authenticated)
export class LearnerTrackController {
  userId: string = 'USER_ID';
  constructor(public service: TrackService) {}

  @ApiOperation({title: 'Get My Tracks'})
  @HttpCode(200)
  @Get()
  async getMyTracks(): Promise<any> {
    try {
      return await this.service.getLearnerTracks(this.userId);
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
}
