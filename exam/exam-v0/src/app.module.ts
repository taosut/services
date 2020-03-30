import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Attempt } from './exam/attempt/attempt.entity';
import { AttemptModule } from './exam/attempt/attempt.module';
import { AttemptDetail } from './exam/attempt/attemptDetail/attemptDetail.entity';
import { AttemptDetailModule } from './exam/attempt/attemptDetail/attemptDetail.module';
import { Exam } from './exam/exam.entity';
import { ExamModule } from './exam/exam.module';
import { Answer } from './exam/question/answer/answer.entity';
import { AnswerModule } from './exam/question/answer/answer.module';
import { Question } from './exam/question/question.entity';
import { QuestionModule } from './exam/question/question.module';
import * as migration from './migrations';

export function moduleFactory(
  host: string,
  password: string,
  username: string,
  port: number
): any {
  const dbConfig: TypeOrmModuleOptions = {
    type: 'mysql',
    host,
    password,
    username,
    database: process.env.TYPEORM_DATABASE,
    port,
    entities: [Exam, Question, Answer, Attempt, AttemptDetail],
    logging: Boolean(process.env.TYPEORM_LOGGING),
    synchronize: false,
    migrationsRun: true,
    migrations: [migration.InitDB1568609868555],
  };

  @Module({
    imports: [
      TypeOrmModule.forRoot(dbConfig),
      ExamModule,
      QuestionModule,
      AnswerModule,
      AttemptModule,
      AttemptDetailModule,
    ],
  })
  class MainModule {}

  return MainModule;
}
