import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TrackCompletionService } from './trackcompletion.service';
import { TrackCompletion } from '../../models/trackcompletion/trackcompletion.entity';
import { TrackCompletionController } from '../../controllers/trackcompletion/trackcompletion.controller';
import { TrackModule } from '../track/track.module';

/**
 * Import and provide seeder classes for languages.
 *
 * @module
 */
@Module({
  imports: [TypeOrmModule.forFeature([TrackCompletion]), TrackModule],
  providers: [TrackCompletionService],
  controllers: [TrackCompletionController],
  exports: [TrackCompletionService],
})
export class TrackCompletionModule {}
