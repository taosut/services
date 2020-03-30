import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassInvokeService } from '../../services/class.service';
import { LessonInvokeService } from '../../services/lesson.service';
import { PlaylistInvokeService } from '../../services/playlist.service';
import { LearningCompletionModule } from '../learningCompletion/learningCompletion.module';
import { PlaylistCompletionModule } from '../playlistCompletion/playlistCompletion.module';
import { LessonCompletionController } from './lessonCompletion.controller';
import { LessonCompletion } from './lessonCompletion.entity';
import { LessonCompletionService } from './lessonCompletion.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([LessonCompletion]),
    forwardRef(() => PlaylistCompletionModule),
    forwardRef(() => LearningCompletionModule),
  ],
  providers: [
    LessonCompletionService,
    ClassInvokeService,
    PlaylistInvokeService,
    LessonInvokeService,
  ],
  controllers: [LessonCompletionController],
  exports: [
    LessonCompletionService,
    ClassInvokeService,
    PlaylistInvokeService,
    LessonInvokeService,
  ],
})
export class LessonCompletionModule {}
