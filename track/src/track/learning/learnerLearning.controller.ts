import {
  Controller, Param, HttpException, Post, Body, HttpCode, Get, Patch, Query,
} from '@nestjs/common';
import {
  ApiUseTags, ApiOperation,
} from '@nestjs/swagger';
import { TrackService } from '../track.service';
import { LearningMembershipDto, LearningMembershipStatusDto } from './membership/LearningMembershipDto';
import { LearningMembershipService } from './membership/learningMembership.service';
import { GeneralFilter, MyTrackFilter } from '../generalFilter';
import { LearningService } from './learning.service';

@ApiUseTags('[Learner] Learning')
@Controller('learner/learnings')
// @UseGuards(TrackGuard)
// @Roles(DefaultRoles.authenticated)
export class LearnerLearningController {
  userId: string = 'USER_ID';
  constructor(public trackService: TrackService,
              public learningService: LearningService,
              public learningMembershipService: LearningMembershipService) {}

  @ApiOperation({title: 'Get My Learnings'})
  @HttpCode(200)
  @Get()
  async getMyLearnings(@Query() query: MyTrackFilter): Promise<object[]> {
    try {
      return await this.learningService.findLearningByLearner(this.userId, query);
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  @ApiOperation({title: 'Update Membership Status of Learning'})
  @HttpCode(200)
  @Patch(':learningId/membership')
  async changeMembershipStatus(@Param('learningId') learningId: string, @Body() body: LearningMembershipStatusDto) {
    try {
      return await this.learningMembershipService.changeJoinStatus(learningId, this.userId, body.has_joined);
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
}
