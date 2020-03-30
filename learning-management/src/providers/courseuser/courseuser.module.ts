import { Module } from '@nestjs/common';
import { CourseUserService } from './courseuser.service';
import { CourseUserController } from '../../controllers/courseuser/courseuser.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseUser } from '../../models/courseuser/courseuser.entity';
import { PlaylistModule } from '../playlist/playlist.module';
import { CourseModule } from '../course/course.module';

@Module({
  imports: [TypeOrmModule.forFeature([CourseUser]), CourseModule],
  providers: [CourseUserService],
  controllers: [CourseUserController],
  exports: [CourseUserService],
})
export class CourseUserModule {}
