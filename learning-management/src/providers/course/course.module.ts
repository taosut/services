import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from '../../controllers/course/course.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from '../../models/course/course.entity';
import { PlaylistModule } from '../playlist/playlist.module';

@Module({
  imports: [TypeOrmModule.forFeature([Course]), PlaylistModule],
  providers: [CourseService],
  controllers: [CourseController],
  exports: [CourseService],
})
export class CourseModule {}
