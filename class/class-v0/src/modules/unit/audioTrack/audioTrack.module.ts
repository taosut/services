import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AudioTrackController } from './audioTrack.controller';
import { AudioTrack } from './audioTrack.entity';
import { AudioTrackService } from './audioTrack.service';
@Module({
  imports: [TypeOrmModule.forFeature([AudioTrack])],
  providers: [AudioTrackService],
  controllers: [AudioTrackController],
  exports: [AudioTrackService],
})
export class AudioTrackModule {}
