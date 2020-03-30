import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as migration from './migrations';
import { Class } from './modules/class/class.entity';
import { ClassModule } from './modules/class/class.module';
import { Track } from './modules/track/track.entity';
import { TrackModule } from './modules/track/track.module';
import { AudioTrack } from './modules/unit/audioTrack/audioTrack.entity';
import { AudioTrackModule } from './modules/unit/audioTrack/audioTrack.module';
import { Ebook } from './modules/unit/ebook/ebook.entity';
import { EbookModule } from './modules/unit/ebook/ebook.module';
import { Unit } from './modules/unit/unit.entity';
import { UnitModule } from './modules/unit/unit.module';
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
    entities: [Class, Track, Unit, Ebook, AudioTrack],
    logging: Boolean(process.env.TYPEORM_LOGGING),
    synchronize: false,
    migrationsRun: true,
    migrations: [migration.initDb1569903023821],
  };
  @Module({
    imports: [
      TypeOrmModule.forRoot(dbConfig),
      ClassModule,
      TrackModule,
      UnitModule,
      EbookModule,
      AudioTrackModule,
    ],
  })
  class AppModule {}

  return AppModule;
}
