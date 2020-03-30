import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from '../../models/course/course.entity';
import { AuthorCourseController } from '../../controllers/course/author_course.controller';
import { PlaylistModule } from '../playlist/playlist.module';

@Module({
  imports: [TypeOrmModule.forFeature([Course]), PlaylistModule],
  providers: [CourseService],
  controllers: [AuthorCourseController],
  exports: [],
})
export class AuthorCourseModule {}
