import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { QuizQuestionService } from './quizquestion.service';
import { QuizQuestion } from '../../models/quizquestion/quizquestion.entity';
import { QuizQuestionController } from '../../controllers/quizquestion/quizquestion.controller';
import { QuizAnswerModule } from '../quizanswer/quizanswer.module';
import { LessonModule } from '../../providers/lesson/lesson.module';

/**
 * Import and provide seeder classes for languages.
 *
 * @module
 */
@Module({
  imports: [TypeOrmModule.forFeature([QuizQuestion]), LessonModule, QuizAnswerModule],
  providers: [QuizQuestionService],
  controllers: [QuizQuestionController],
  exports: [QuizQuestionService],
})
export class QuizQuestionModule {}
