import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { FinalExamAnswerService } from './final_exam_answer.service';
import { FinalExamAnswer } from '../../models/final_exam_answer/final_exam_answer.entity';
import { FinalExamAnswerController } from '../../controllers/final_exam_answer/final_exam_answer.controller';

/**
 * Import and provide seeder classes for languages.
 *
 * @module
 */
@Module({
  imports: [TypeOrmModule.forFeature([FinalExamAnswer])],
  providers: [FinalExamAnswerService],
  controllers: [FinalExamAnswerController],
  exports: [FinalExamAnswerService],
})
export class FinalExamAnswerModule {}
