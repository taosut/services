import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CourseSeederService } from './course.service';
import { Course } from '../../../models/course/course.entity';

/**
 * Import and provide seeder classes for languages.
 *
 * @module
 */
@Module({
  imports: [TypeOrmModule.forFeature([Course])],
  providers: [CourseSeederService],
  exports: [CourseSeederService],
})
export class CourseSeederModule {}
