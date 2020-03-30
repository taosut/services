import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { QuizAnswerSeederService } from './quizanswer.service';
import { QuizAnswer } from '../../../models/quizanswer/quizanswer.entity';

/**
 * Import and provide seeder classes for languages.
 *
 * @module
 */
@Module({
  imports: [TypeOrmModule.forFeature([QuizAnswer])],
  providers: [QuizAnswerSeederService],
  exports: [QuizAnswerSeederService],
})
export class QuizAnswerSeederModule {}
