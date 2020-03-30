import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as redisStore from 'cache-manager-ioredis';
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
  port: number,
  redisHost: string,
  redisPort: number
): any {
  const dbConfig: TypeOrmModuleOptions = {
    type: 'mysql',
    host,
    password,
    username,
    database: process.env.TYPEORM_DATABASE,
    port,
    entities: [Exam, Question, Answer],
    logging: Boolean(process.env.TYPEORM_LOGGING),
    synchronize: false,
    migrationsRun: true,
    migrations: [
      migration.InitDB1569377762988,
      migration.AddMetaColumnToExam1569990684322,
      migration.ChangeOnCascadeQuestion1570097739402,
      migration.AddColumnCaseStudy1570681464451,
      migration.AddColumnImageVideo1571625841323,
      migration.AddColumnTypeInExam1572177250435,
    ],
  };

  @Module({
    imports: [
      TypeOrmModule.forRoot(dbConfig),
      CacheModule.register({
        store: redisStore,
        host: redisHost,
        port: redisPort,
        ttl: Number(process.env.REDIS_MAX_TTL), // seconds
        // max: 10, // maximum number of items in cache
      }),
      ExamModule,
      QuestionModule,
      AnswerModule,
    ],
    providers: [
      {
        provide: APP_INTERCEPTOR,
        useClass: CacheInterceptor,
      },
    ],
  })
  class MainModule {}

  return MainModule;
}
