import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { FinalExamQuestionSeederService } from './final_exam_question.service';
import { FinalExamQuestion } from '../../../models/final_exam_question/final_exam_question.entity';

/**
 * Import and provide seeder classes for languages.
 *
 * @module
 */
@Module({
  imports: [TypeOrmModule.forFeature([FinalExamQuestion])],
  providers: [FinalExamQuestionSeederService],
  exports: [FinalExamQuestionSeederService],
})
export class FinalExamQuestionSeederModule {}
