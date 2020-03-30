import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { FinalExamQuestionService } from './final_exam_question.service';
import { FinalExamQuestion } from '../../models/final_exam_question/final_exam_question.entity';
import { FinalExamQuestionController } from '../../controllers/final_exam_question/final_exam_question.controller';
import { FinalExamAnswerModule } from '../final_exam_answer/final_exam_answer.module';
import { FinalExamModule } from '../final_exam/final_exam.module';
import { FinalExamService } from '../final_exam/final_exam.service';

/**
 * Import and provide seeder classes for languages.
 *
 * @module
 */
@Module({
  imports: [TypeOrmModule.forFeature([FinalExamQuestion]), forwardRef(() => FinalExamModule), FinalExamAnswerModule],
  providers: [FinalExamQuestionService, FinalExamService],
  controllers: [FinalExamQuestionController],
  exports: [FinalExamQuestionService],
})
export class FinalExamQuestionModule {}
