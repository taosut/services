import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TrackService } from '../track.service';
import { Track } from '../track.entity';
import { LearningMembershipInvokeService } from '../../invoke-services/learningMembership.service';
import { LearningInvokeService } from '../../invoke-services/learning.service';
import { LearnerLearningController } from './learnerLearning.controller';
import { LearnerTrackController } from '../learnerTrack.controller';
import { LearningService } from './learning.service';
import { LearningMembershipService } from './membership/learningMembership.service';
@Module({
  imports: [TypeOrmModule.forFeature([Track])],
  providers: [
    TrackService, LearningInvokeService, LearningMembershipInvokeService, LearningService, LearningMembershipService,
  ],
  controllers: [
    LearnerLearningController, LearnerTrackController,
  ],
  exports: [
    TrackService, LearningInvokeService, LearningMembershipInvokeService, LearningService, LearningMembershipService,
  ],
})
export class LearningModule {}
