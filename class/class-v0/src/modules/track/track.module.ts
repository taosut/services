import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassModule } from '../class/class.module';
import { UnitModule } from '../unit/unit.module';
import { TrackController } from './track.controller';
import { Track } from './track.entity';
import { TrackService } from './track.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Track]),
    forwardRef(() => UnitModule),
    forwardRef(() => ClassModule),
  ],
  providers: [TrackService],
  controllers: [TrackController],
  exports: [TrackService],
})
export class TrackModule {}
