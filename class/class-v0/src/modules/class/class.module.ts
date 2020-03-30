import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentInvokeService } from '../../services/invokes/content.service';
import { MembershipsInvokeService } from '../../services/invokes/membership.service';
import { TrackModule } from '../track/track.module';
import { ClassController } from './class.controller';
import { Class } from './class.entity';
import { ClassService } from './class.service';
import { LearnerClassController } from './learnerClass.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Class]), forwardRef(() => TrackModule)],
  providers: [ClassService, MembershipsInvokeService, ContentInvokeService],
  controllers: [LearnerClassController, ClassController],
  exports: [ClassService, MembershipsInvokeService, ContentInvokeService],
})
export class ClassModule {}
