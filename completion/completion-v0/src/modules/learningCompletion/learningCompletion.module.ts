import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttemptInvokeService } from '../../services/attempt.service';
import { ClassInvokeService } from '../../services/class.service';
import { PlaylistInvokeService } from '../../services/playlist.service';
import { LessonCompletionModule } from '../lessonCompletion/lessonCompletion.module';
import { PlaylistCompletionModule } from '../playlistCompletion/playlistCompletion.module';
import { LearningCompletionController } from './learningCompletion.controller';
import { LearningCompletion } from './learningCompletion.entity';
import { LearningCompletionService } from './learningCompletion.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([LearningCompletion]),
    forwardRef(() => PlaylistCompletionModule),
    forwardRef(() => LessonCompletionModule),
  ],
  providers: [
    LearningCompletionService,
    ClassInvokeService,
    PlaylistInvokeService,
    AttemptInvokeService,
  ],
  controllers: [LearningCompletionController],
  exports: [
    LearningCompletionService,
    ClassInvokeService,
    PlaylistInvokeService,
    AttemptInvokeService,
  ],
})
export class LearningCompletionModule {}
