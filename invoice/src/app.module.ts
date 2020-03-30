import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Invoice } from './invoice/invoice.entity';
import { InvoiceModule } from './invoice/invoice.module';
import * as migrations from './migrations';

export function moduleFactory(
  host: string,
  password: string,
  username: string,
  port: number,
): any {
  const dbConfig: TypeOrmModuleOptions = {
    type: 'mysql',
    host,
    password,
    username,
    database: process.env.TYPEORM_DATABASE,
    port,
    entities: [Invoice],
    logging: Boolean(process.env.TYPEORM_LOGGING),
    synchronize: false,
    migrationsRun: true,
    migrations: [
      migrations.InitDB1564017926345,
      migrations.InvoiceTimestamp1564059645714,
    ],
  };

  @Module({
    imports: [TypeOrmModule.forRoot(dbConfig), InvoiceModule],
  })
  class AppModule {}

  return AppModule;
}
