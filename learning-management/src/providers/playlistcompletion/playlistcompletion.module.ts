import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PlaylistCompletionService } from './playlistcompletion.service';
import { PlaylistCompletion } from '../../models/playlistcompletion/playlistcompletion.entity';
import { PlaylistCompletionController } from '../../controllers/playlistcompletion/playlistcompletion.controller';
import { PlaylistModule } from '../playlist/playlist.module';

/**
 * Import and provide seeder classes for languages.
 *
 * @module
 */
@Module({
  imports: [TypeOrmModule.forFeature([PlaylistCompletion]), PlaylistModule],
  providers: [PlaylistCompletionService],
  controllers: [PlaylistCompletionController],
  exports: [PlaylistCompletionService],
})
export class PlaylistCompletionModule {}
