import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { FinalExamAttemptService } from './final_exam_attempt.service';
import { FinalExamAttempt } from '../../models/final_exam_attempt/final_exam_attempt.entity';
import { FinalExamAttemptController } from '../../controllers/final_exam_attempt/final_exam_attempt.controller';

/**
 * Import and provide seeder classes for languages.
 *
 * @module
 */
@Module({
  imports: [TypeOrmModule.forFeature([FinalExamAttempt])],
  providers: [FinalExamAttemptService],
  controllers: [FinalExamAttemptController],
  exports: [FinalExamAttemptService],
})
export class FinalExamAttemptModule {}
