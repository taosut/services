import {
  Controller, Param, HttpException, Post, Body, HttpCode, Get, Patch,
} from '@nestjs/common';
import {
  ApiUseTags, ApiOperation,
} from '@nestjs/swagger';
import { LearningMembershipService } from './learningMembership.service';
import { TrackService } from '../../track.service';
import { LearningMembershipDto, LearningMembershipStatusDto } from './LearningMembershipDto';
import { ParsedRequest, CrudRequest, Crud } from '@nestjsx/crud';
import { ParsedRequestParams } from '@nestjsx/crud-request';

@ApiUseTags('Learning')
@Controller('learnings/:learningId/members')
// @UseGuards(TrackGuard)
// @Roles(DefaultRoles.authenticated)
export class LearningMembershipController {
  userId: string = 'USER_ID';
  constructor(public trackService: TrackService, public service: LearningMembershipService) {}

  @ApiOperation({title: 'Get Member of Learning'})
  @HttpCode(200)
  @Get()
  async getMembership(@Param('learningId') learningId: string) {
    try {
      return await this.service.getMemberByLearningId(learningId);
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  @ApiOperation({title: 'Add and Remove Member of Learning'})
  @HttpCode(200)
  @Post()
  async addRemoveMembership(@Param('learningId') learningId: string, @Body() body: LearningMembershipDto) {
    try {
      return await this.service.addRemoveMembershipLearning(learningId, body);
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  @ApiOperation({title: '[Learner] Change Join Status of Learning'})
  @HttpCode(200)
  @Patch()
  async changeMembershipStatus(@Param('learningId') learningId: string, @Body() body: LearningMembershipStatusDto) {
    try {
      return await this.service.changeJoinStatus(learningId, this.userId, body.has_joined);
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
}
