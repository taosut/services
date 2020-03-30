import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TrackService } from '../../track.service';
import { Track } from '../../track.entity';
import { LearningMembershipService } from './learningMembership.service';
import { LearningMembershipController } from './learningMembership.controller';
import { TrackModule } from '../../track.module';
@Module({
  imports: [
    TrackModule,
  ],
  providers: [
    TrackService, LearningMembershipService,
  ],
  controllers: [
    LearningMembershipController,
  ],
  exports: [
    TrackService, LearningMembershipService,
  ],
})
export class LearningMembershipModule {}
