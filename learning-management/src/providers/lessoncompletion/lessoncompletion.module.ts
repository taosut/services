import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { LessonCompletionService } from './lessoncompletion.service';
import { LessonCompletion } from '../../models/lessoncompletion/lessoncompletion.entity';
import { LessonCompletionController } from '../../controllers/lessoncompletion/lessoncompletion.controller';
import { LessonModule } from '../lesson/lesson.module';
import { PlaylistCompletionModule } from '../playlistcompletion/playlistcompletion.module';
import { QuizAttemptModule } from '../../providers/quizattempt/quizattempt.module';
import { PlaylistModule } from '../playlist/playlist.module';
import { CourseCompletionModule } from '../coursecompletion/coursecompletion.module';
import { CourseModule } from '../course/course.module';
import { TrackModule } from '../../providers/track/track.module';
import { TrackCompletionModule } from '../trackcompletion/trackcompletion.module';

/**
 * Import and provide seeder classes for languages.
 *
 * @module
 */
@Module({
  imports: [TypeOrmModule.forFeature([LessonCompletion]), LessonModule,
    PlaylistCompletionModule, QuizAttemptModule, PlaylistModule,
    CourseCompletionModule, CourseModule,
    TrackCompletionModule, TrackModule ],
  providers: [LessonCompletionService],
  controllers: [LessonCompletionController],
  exports: [LessonCompletionService],
})
export class LessonCompletionModule {}
