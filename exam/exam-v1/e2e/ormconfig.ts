import { TypeOrmModule } from '@nestjs/typeorm';
import dotenv = require('dotenv');
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
      type: 'mysql',
      host: process.env.TYPEORM_HOST,
      password: process.env.TYPEORM_PASSWORD,
      username: process.env.TYPEORM_USERNAME,
      database: process.env.TYPEORM_DATABASE,
      port: Number(process.env.TYPEORM_PORT),
      entities: [Exam, Question, Answer],
      logging: Boolean(process.env.TYPEORM_LOGGING),
      synchronize: true,
      dropSchema: true,
    }),
    ExamModule,
    QuestionModule,
    AnswerModule,
  ],
};
