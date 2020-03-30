import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamModule } from '../exam.module';
import { LearnerAttemptController } from '../learner/attempt/learnerAttempt.controller';
import { QuestionModule } from '../question/question.module';
import { AttemptController } from './attempt.controller';
import { Attempt } from './attempt.entity';
import { AttemptService } from './attempt.service';
import { AttemptDetailModule } from './attemptDetail/attemptDetail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attempt]),
    forwardRef(() => ExamModule),
    QuestionModule,
    forwardRef(() => AttemptDetailModule),
  ],
  providers: [AttemptService],
  controllers: [AttemptController, LearnerAttemptController],
  exports: [AttemptService],
})
export class AttemptModule {}
