import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { Playlist } from '../../models/playlist/playlist.entity';
import { PlaylistController } from '../../controllers/playlist/playlist.controller';
import { LessonModule } from '../lesson/lesson.module';

/**
 * Import and provide seeder classes for languages.
 *
 * @module
 */
@Module({
  imports: [TypeOrmModule.forFeature([Playlist]), LessonModule],
  providers: [PlaylistService],
  controllers: [PlaylistController],
  exports: [PlaylistService],
})
export class PlaylistModule {}
