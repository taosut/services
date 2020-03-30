import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as redisStore from 'cache-manager-ioredis';
import { ClassMembership } from './classMembership/classMembership.entity';
import { ClassMembershipModule } from './classMembership/classMembership.module';
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
    entities: [ClassMembership],
    logging: Boolean(process.env.TYPEORM_LOGGING),
    synchronize: false,
    migrationsRun: true,
    migrations: [migration.InitDB1568607980040],
    // cache: {
    //   type: 'redis',
    //   options: {
    //     host: process.env.REDIS_HOST,
    //     port: process.env.REDIS_PORT,
    //   },
    // },
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
      ClassMembershipModule,
    ],
    providers: [
      {
        provide: APP_INTERCEPTOR,
        useClass: CacheInterceptor,
      },
    ],
  })
  class AppModule {}

  return AppModule;
}
