import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from '../../models/course/course.entity';
import { CourseUserModule } from '../courseuser/courseuser.module';
import { LearnerCourseController } from '../../controllers/course/learner_course.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Course]), CourseUserModule],
  providers: [CourseService],
  controllers: [LearnerCourseController],
  exports: [],
})
export class LearnerCourseModule {}
