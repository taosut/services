import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as redisStore from 'cache-manager-ioredis';
import { Certificate } from './certificate/certificate.entity';
import { CertificateModule } from './certificate/certificate.module';
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
    entities: [Certificate],
    logging: Boolean(process.env.TYPEORM_LOGGING),
    synchronize: false,
    migrationsRun: true,
    migrations: [
      migration.InitDB1569565974423,
      migration.AddColumnUrlToCertificate1570869837632,
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
      CertificateModule,
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
