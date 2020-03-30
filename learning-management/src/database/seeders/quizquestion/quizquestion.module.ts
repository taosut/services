import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { QuizQuestionSeederService } from './quizquestion.service';
import { QuizQuestion } from '../../../models/quizquestion/quizquestion.entity';

/**
 * Import and provide seeder classes for languages.
 *
 * @module
 */
@Module({
  imports: [TypeOrmModule.forFeature([QuizQuestion])],
  providers: [QuizQuestionSeederService],
  exports: [QuizQuestionSeederService],
})
export class QuizQuestionSeederModule {}
