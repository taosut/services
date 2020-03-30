import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CourseUserSeederService } from './courseuser.service';
import { CourseUser } from '../../../models/courseuser/courseuser.entity';

/**
 * Import and provide seeder classes for languages.
 *
 * @module
 */
@Module({
  imports: [TypeOrmModule.forFeature([CourseUser])],
  providers: [CourseUserSeederService],
  exports: [CourseUserSeederService],
})
export class CourseUserSeederModule {}
