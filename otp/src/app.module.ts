import { HttpModule } from '@magishift/http';
import { IRedisModuleOptions, RedisModule } from '@magishift/redis';
import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import dotenv = require('dotenv');
import * as migrations from '../migrations';
import { entities } from './entities';
import { SmsConfigurationModule } from './smsConfiguration/smsConfiguration.module';
import { SmsOtpModule } from './smsOtp/smsOtp.module';

const { parsed } = dotenv.config({
  path: process.cwd() + '/.env',
});

process.env = { ...parsed, ...process.env };

const redisConfig: IRedisModuleOptions = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
};

const dbConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.TYPEORM_HOST,
  password: process.env.TYPEORM_PASSWORD,
  username: process.env.TYPEORM_USERNAME,
  database: process.env.TYPEORM_DATABASE,
  port: Number(process.env.TYPEORM_PORT),
  entities,
  migrations: [migrations.initDb1561359718146],
  synchronize: false,
  migrationsRun: true,
};

@Module({
  imports: [
    RedisModule.register(redisConfig),
    TypeOrmModule.forRoot(dbConfig),
    HttpModule,
    SmsOtpModule,
    SmsConfigurationModule,
  ],
})
export class AppModule {}
