import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { FinalExamService } from './final_exam.service';
import { FinalExam } from '../../models/final_exam/final_exam.entity';
import { FinalExamController } from '../../controllers/final_exam/final_exam.controller';
import { FinalExamQuestionModule } from '../final_exam_question/final_exam_question.module';
import { FinalExamAnswerModule } from '../final_exam_answer/final_exam_answer.module';
import { FinalExamQuestionService } from '../final_exam_question/final_exam_question.service';
import { FinalExamAnswerService } from '../final_exam_answer/final_exam_answer.service';
import { FinalExamQuestionController } from '../../controllers/final_exam_question/final_exam_question.controller';
import { FinalExamAttemptModule } from '../final_exam_attempt/final_exam_attempt.module';
import { FinalExamAttemptDetailModule } from '../final_exam_attempt_detail/final_exam_attempt_detail.module';
import { FinalExamAttemptService } from '../final_exam_attempt/final_exam_attempt.service';
import { FinalExamAttemptDetailService } from '../final_exam_attempt_detail/final_exam_attempt_detail.service';
import { LearnerFinalExamController } from '../../controllers/learner_final_exam/learner_final_exam.controller';
import { FinalExamAnswerController } from '../../controllers/final_exam_answer/final_exam_answer.controller';
import { FinalExamAttemptController } from '../../controllers/final_exam_attempt/final_exam_attempt.controller';

/**
 * Import and provide seeder classes for languages.
 *
 * @module
 */
@Module({
  imports: [ TypeOrmModule.forFeature([FinalExam]),
            FinalExamQuestionModule, FinalExamAnswerModule,
            FinalExamAttemptModule, FinalExamAttemptDetailModule,
          ],
  providers: [ FinalExamService,
            FinalExamQuestionService, FinalExamAnswerService,
            FinalExamAttemptService, FinalExamAttemptDetailService,
          ],
  controllers: [ FinalExamController,
            FinalExamQuestionController, FinalExamAnswerController,
            FinalExamAttemptController,
            LearnerFinalExamController,
          ],
  exports: [ FinalExamService,
            FinalExamQuestionService, FinalExamAnswerService,
            FinalExamAttemptService, FinalExamAttemptDetailService,
          ],
})
export class FinalExamModule {}
