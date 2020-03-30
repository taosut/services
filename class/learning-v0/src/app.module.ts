import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as migrations from './migrations';
import { Learning } from './modules/learning/learning.entity';
import { LearningModule } from './modules/learning/learning.module';
import { AudioPlaylist } from './modules/lesson/audioPlaylist/audioPlaylist.entity';
import { AudioPlaylistModule } from './modules/lesson/audioPlaylist/audioPlaylist.module';
import { Ebook } from './modules/lesson/ebook/ebook.entity';
import { EbookModule } from './modules/lesson/ebook/ebook.module';
import { Lesson } from './modules/lesson/lesson.entity';
import { LessonModule } from './modules/lesson/lesson.module';
import { Playlist } from './modules/playlist/playlist.entity';
import { PlaylistModule } from './modules/playlist/playlist.module';
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
    entities: [Learning, Playlist, Lesson, Ebook, AudioPlaylist],
    logging: Boolean(process.env.TYPEORM_LOGGING),
    synchronize: false,
    migrationsRun: true,
    migrations: [
      migrations.initDb1565353553145,
      migrations.initDb21566365098959,
      migrations.initDb31566460234364,
      migrations.CRFIELD11566969680558,
      migrations.CRFieldLearning1567506339417,
      migrations.CRFieldLearning021567570613387,
    ],
  };
  @Module({
    imports: [
      TypeOrmModule.forRoot(dbConfig),
      LearningModule,
      PlaylistModule,
      LessonModule,
      EbookModule,
      AudioPlaylistModule,
    ],
  })
  class AppModule {}

  return AppModule;
}
