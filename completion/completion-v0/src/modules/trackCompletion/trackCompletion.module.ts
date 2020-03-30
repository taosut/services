import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackCompletionController } from './trackCompletion.controller';
import { TrackCompletion } from './trackCompletion.entity';
import { TrackCompletionService } from './trackCompletion.service';
@Module({
  imports: [TypeOrmModule.forFeature([TrackCompletion])],
  providers: [TrackCompletionService],
  controllers: [TrackCompletionController],
  exports: [TrackCompletionService],
})
export class TrackCompletionModule {}
