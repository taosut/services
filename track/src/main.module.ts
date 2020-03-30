import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as migration from './migrations';
import { Track } from './track/track.entity';
import { TrackModule } from './track/track.module';
import { LearningMembershipModule } from './track/learning/membership/learningMembership.module';
import { LearningModule } from './track/learning/learning.module';

export function moduleFactory(
  host: string,
  password: string,
  username: string,
  port: number,
  redisHost: string,
  redisPort: number,
): any {
  const dbConfig: TypeOrmModuleOptions = {
    type: 'mysql',
    host,
    password,
    username,
    database: process.env.TYPEORM_DATABASE,
    port,
    entities: [ Track ],
    logging: Boolean(process.env.TYPEORM_LOGGING),
    synchronize: false,
    migrationsRun: true,
    migrations: [
      migration.TrackMigration1564048562216,
      migration.AddColumnIndexLearningsToTrack1564382303837,
    ],
  };

  @Module({
    imports: [
      TypeOrmModule.forRoot(dbConfig),
      TrackModule,
      LearningMembershipModule,
      LearningModule,
    ],
  })
  class MainModule {}

  return MainModule;
}
