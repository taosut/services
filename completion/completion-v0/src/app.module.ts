import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as migration from './migrations';
import { LearningCompletion } from './modules/learningCompletion/learningCompletion.entity';
import { LearningCompletionModule } from './modules/learningCompletion/learningCompletion.module';
import { LessonCompletion } from './modules/lessonCompletion/lessonCompletion.entity';
import { LessonCompletionModule } from './modules/lessonCompletion/lessonCompletion.module';
import { PlaylistCompletion } from './modules/playlistCompletion/playlistCompletion.entity';
import { PlaylistCompletionModule } from './modules/playlistCompletion/playlistCompletion.module';
import { TrackCompletion } from './modules/trackCompletion/trackCompletion.entity';
import { TrackCompletionModule } from './modules/trackCompletion/trackCompletion.module';

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
    entities: [
      LessonCompletion,
      PlaylistCompletion,
      LearningCompletion,
      TrackCompletion,
    ],
    logging: Boolean(process.env.TYPEORM_LOGGING),
    synchronize: false,
    migrationsRun: true,
    migrations: [
      migration.initDb1567058224662,
      migration.initDb21567072600249,
      migration.initDb31567751572314,
    ],
  };
  @Module({
    imports: [
      TypeOrmModule.forRoot(dbConfig),
      LessonCompletionModule,
      PlaylistCompletionModule,
      LearningCompletionModule,
      TrackCompletionModule,
    ],
  })
  class AppModule {}

  return AppModule;
}
