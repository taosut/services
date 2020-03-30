import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LearningModule } from '../learning/learning.module';
import { LessonModule } from '../lesson/lesson.module';
import { PlaylistController } from './playlist.controller';
import { PlaylistDto } from './playlist.dto';
import { Playlist } from './playlist.entity';
import { PlaylistService } from './playlist.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Playlist]),
    forwardRef(() => LessonModule),
    forwardRef(() => LearningModule),
  ],
  providers: [PlaylistService, PlaylistDto],
  controllers: [PlaylistController],
  exports: [PlaylistService],
})
export class PlaylistModule {}
