import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentInvokeService } from '../../services/invokes/content.service';
import { ExamInvokeService } from '../../services/invokes/exam.service';
import { TrackModule } from '../track/track.module';
import { AudioTrackModule } from './audioTrack/audioTrack.module';
import { EbookModule } from './ebook/ebook.module';
import { UnitController } from './unit.controller';
import { Unit } from './unit.entity';
import { UnitService } from './unit.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Unit]),
    forwardRef(() => TrackModule),
    forwardRef(() => EbookModule),
    forwardRef(() => AudioTrackModule),
  ],
  providers: [UnitService, ExamInvokeService, ContentInvokeService],
  controllers: [UnitController],
  exports: [UnitService, ExamInvokeService, ContentInvokeService],
})
export class UnitModule {}
