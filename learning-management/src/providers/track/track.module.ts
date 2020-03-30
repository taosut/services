import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { Track } from '../../models/track/track.entity';
import { TrackController } from '../../controllers/track/track.controller';
import { CourseModule } from '../course/course.module';
import { LearnerTrackController } from '../../controllers/track/learner_track.controller';

/**
 * Import and provide seeder classes for languages.
 *
 * @module
 */
@Module({
  imports: [TypeOrmModule.forFeature([Track]), CourseModule],
  providers: [TrackService],
  controllers: [TrackController, LearnerTrackController],
  exports: [TrackService],
})
export class TrackModule {}
