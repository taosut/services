import { TypeOrmModule } from '@nestjs/typeorm';
import dotenv = require('dotenv');
import { Attempt } from '../src/exam/attempt/attempt.entity';
import { AttemptModule } from '../src/exam/attempt/attempt.module';
import { AttemptDetail } from '../src/exam/attempt/attemptDetail/attemptDetail.entity';
import { AttemptDetailModule } from '../src/exam/attempt/attemptDetail/attemptDetail.module';
import { Exam } from '../src/exam/exam.entity';
import { ExamModule } from '../src/exam/exam.module';
import { Answer } from '../src/exam/question/answer/answer.entity';
import { AnswerModule } from '../src/exam/question/answer/answer.module';
import { Question } from '../src/exam/question/question.entity';
import { QuestionModule } from '../src/exam/question/question.module';

const { parsed } = dotenv.config({
  path: process.cwd() + '/.env.test',
});
process.env = { ...parsed, ...process.env };

export const ormconfig = {
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      entities: [Exam, Question, Answer, Attempt, AttemptDetail],
      synchronize: true,
    }),
    ExamModule,
    QuestionModule,
    AnswerModule,
    AttemptModule,
    AttemptDetailModule,
  ],
};
