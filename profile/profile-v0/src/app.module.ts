import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as redisStore from 'cache-manager-ioredis';
import * as migration from './migrations';
import { Profile } from './profile/profile.entity';
import { ProfileModule } from './profile/profile.module';

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
    entities: [Profile],
    logging: Boolean(process.env.TYPEORM_LOGGING),
    synchronize: false,
    migrationsRun: true,
    migrations: [migration.Profile1568374689344],
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
      ProfileModule,
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
