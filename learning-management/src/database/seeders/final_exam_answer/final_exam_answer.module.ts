import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { FinalExamAnswerSeederService } from './final_exam_answer.service';
import { FinalExamAnswer } from '../../../models/final_exam_answer/final_exam_answer.entity';

/**
 * Import and provide seeder classes for languages.
 *
 * @module
 */
@Module({
  imports: [TypeOrmModule.forFeature([FinalExamAnswer])],
  providers: [FinalExamAnswerSeederService],
  exports: [FinalExamAnswerSeederService],
})
export class FinalExamAnswerSeederModule {}
