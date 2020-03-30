import {
  Controller, Delete, Param, HttpException, Put, Get, Post, Body, HttpCode, Header, Req, UseGuards,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { Track } from './track.entity';
import {
  ApiUseTags, ApiOperation, ApiResponse,
} from '@nestjs/swagger';
import { Crud, Override } from '@nestjsx/crud';
import { LearningTrackDto } from './learningTrack.dto';
import { getUserId } from '../guards/data.guard';

@Crud({
  model: {
    type: Track,
  },
  params: {
    id: {
      field: 'id',
      type: 'string',
      primary: true,
    },
  },
  query: {
  },
})
@ApiUseTags('Track')
@Controller('tracks')
// @UseGuards(TrackGuard)
// @Roles(DefaultRoles.authenticated)
export class TrackController {
  private userId;
  constructor(public service: TrackService) {
  }

  @ApiOperation({title: 'Soft delete one track'})
  @Delete(':id/soft')
  async softDelete(@Param('id') id: string, @Req() req) {
    try {
      this.userId = getUserId(req);
      return await this.service.find({});
      // return await this.service.softDelete(id);
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  @ApiOperation({title: 'Restore one track'})
  @Put(':id/restore')
  async restore(@Param('id') id: string) {
    try {
      return await this.service.restore(id);
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  // @ApiOperation({title: 'Get many learning by trackId'})
  // @Get(':id/learnings')
  // async getLearnings(@Param('id') id: string) {
  //   try {
  //     return await this.service.getLearningByTrackId(id);
  //   } catch (error) {
  //     throw new HttpException(error, 500);
  //   }
  // }

  @ApiOperation({title: 'Add and remove learnings in track'})
  @HttpCode(200)
  @Post(':id/learnings')
  async addRemoveLearningToTrack(@Param('id') id: string, @Body() learningIds: LearningTrackDto) {
    try {
      return await this.service.addRemoveLearningToTrack(id, learningIds);
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
}
