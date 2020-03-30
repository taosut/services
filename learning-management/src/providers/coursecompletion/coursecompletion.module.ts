import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CourseCompletionService } from './coursecompletion.service';
import { CourseCompletion } from '../../models/coursecompletion/coursecompletion.entity';
import { CourseCompletionController } from '../../controllers/coursecompletion/coursecompletion.controller';
import { CourseModule } from '../course/course.module';

/**
 * Import and provide seeder classes for languages.
 *
 * @module
 */
@Module({
  imports: [TypeOrmModule.forFeature([CourseCompletion]), CourseModule],
  providers: [CourseCompletionService],
  controllers: [CourseCompletionController],
  exports: [CourseCompletionService],
})
export class CourseCompletionModule {}
