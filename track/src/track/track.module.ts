import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { Track } from './track.entity';
import { TrackController } from './track.controller';
import { LearningInvokeService } from '../invoke-services/learning.service';
import { LearningMembershipInvokeService } from '../invoke-services/learningMembership.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([Track]),
  ],
  providers: [
    TrackService, LearningInvokeService, LearningMembershipInvokeService,
  ],
  controllers: [
    TrackController,
  ],
  exports: [
    TrackService, LearningInvokeService, LearningMembershipInvokeService,
  ],
})
export class TrackModule {}
