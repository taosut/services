import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TrackSeederService } from './track.service';
import { Track } from '../../../models/track/track.entity';

/**
 * Import and provide seeder classes for languages.
 *
 * @module
 */
@Module({
  imports: [TypeOrmModule.forFeature([Track])],
  providers: [TrackSeederService],
  exports: [TrackSeederService],
})
export class TrackSeederModule {}
