import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { FinalExamAttemptSeederService } from './final_exam_attempt.service';
import { FinalExamAttempt } from '../../../models/final_exam_attempt/final_exam_attempt.entity';

/**
 * Import and provide seeder classes for languages.
 *
 * @module
 */
@Module({
  imports: [TypeOrmModule.forFeature([FinalExamAttempt])],
  providers: [FinalExamAttemptSeederService],
  exports: [FinalExamAttemptSeederService],
})
export class FinalExamAttemptSeederModule {}
