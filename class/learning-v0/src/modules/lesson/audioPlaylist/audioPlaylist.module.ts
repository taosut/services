import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonModule } from '../lesson.module';
import { AudioPlaylistController } from './audioPlaylist.controller';
import { AudioPlaylist } from './audioPlaylist.entity';
import { AudioPlaylistService } from './audioPlaylist.service';

@Module({
  imports: [TypeOrmModule.forFeature([AudioPlaylist]), LessonModule],
  providers: [AudioPlaylistService],
  controllers: [AudioPlaylistController],
  exports: [AudioPlaylistService],
})
export class AudioPlaylistModule {}
