import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { LessonSeederService } from './lesson.service';
import { Lesson } from '../../../models/lesson/lesson.entity';

/**
 * Import and provide seeder classes for languages.
 *
 * @module
 */
@Module({
  imports: [TypeOrmModule.forFeature([Lesson])],
  providers: [LessonSeederService],
  exports: [LessonSeederService],
})
export class LessonSeederModule {}
