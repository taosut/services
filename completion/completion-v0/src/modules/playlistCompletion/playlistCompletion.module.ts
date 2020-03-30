import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttemptInvokeService } from '../../services/attempt.service';
import { ClassInvokeService } from '../../services/class.service';
import { PlaylistInvokeService } from '../../services/playlist.service';
import { LessonCompletionModule } from '../lessonCompletion/lessonCompletion.module';
import { PlaylistCompletionController } from './playlistCompletion.controller';
import { PlaylistCompletion } from './playlistCompletion.entity';
import { PlaylistCompletionService } from './playlistCompletion.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([PlaylistCompletion]),
    forwardRef(() => LessonCompletionModule),
  ],
  providers: [
    PlaylistCompletionService,
    ClassInvokeService,
    PlaylistInvokeService,
    AttemptInvokeService,
  ],
  controllers: [PlaylistCompletionController],
  exports: [
    PlaylistCompletionService,
    ClassInvokeService,
    PlaylistInvokeService,
    AttemptInvokeService,
  ],
})
export class PlaylistCompletionModule {}
