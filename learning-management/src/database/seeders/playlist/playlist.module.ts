import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PlaylistSeederService } from './playlist.service';
import { Playlist } from '../../../models/playlist/playlist.entity';

/**
 * Import and provide seeder classes for languages.
 *
 * @module
 */
@Module({
  imports: [TypeOrmModule.forFeature([Playlist])],
  providers: [PlaylistSeederService],
  exports: [PlaylistSeederService],
})
export class PlaylistSeederModule {}
