import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { FinalExamAttemptDetailService } from './final_exam_attempt_detail.service';
import { FinalExamAttemptDetail } from '../../models/final_exam_attempt_detail/final_exam_attempt_detail.entity';

/**
 * Import and provide seeder classes for languages.
 *
 * @module
 */
@Module({
  imports: [TypeOrmModule.forFeature([FinalExamAttemptDetail])],
  providers: [FinalExamAttemptDetailService],
  exports: [FinalExamAttemptDetailService],
})
export class FinalExamAttemptDetailModule {}
