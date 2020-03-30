import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { LessonService } from '../../providers/lesson/lesson.service';
import { Lesson } from '../../models/lesson/lesson.entity';
import { QuizController } from '../../controllers/quiz/quiz.controller';
import { QuizQuestionModule } from '../quizquestion/quizquestion.module';
import { QuizAttemptModule } from '../quizattempt/quizattempt.module';
import { QuizAttemptDetailModule } from '../quizattemptdetail/quizattemptdetail.module';

/**
 * Import and provide seeder classes for languages.
 *
 * @module
 */
@Module({
  imports: [TypeOrmModule.forFeature([Lesson]), QuizQuestionModule, QuizAttemptModule, QuizAttemptDetailModule],
  providers: [LessonService],
  controllers: [QuizController],
  exports: [LessonService],
})
export class QuizModule {}
