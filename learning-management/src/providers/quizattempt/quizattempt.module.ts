import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { QuizAttemptService } from './quizattempt.service';
import { QuizAttempt } from '../../models/quizattempt/quizattempt.entity';
import { QuizAttemptController } from '../../controllers/quizattempt/quizattempt.controller';

/**
 * Import and provide seeder classes for languages.
 *
 * @module
 */
@Module({
  imports: [TypeOrmModule.forFeature([QuizAttempt])],
  providers: [QuizAttemptService],
  controllers: [QuizAttemptController],
  exports: [QuizAttemptService],
})
export class QuizAttemptModule {}