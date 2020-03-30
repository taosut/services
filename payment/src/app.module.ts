import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as migrations from '../migrations';
import { FileStorageModule } from './fileStorage/fileStorage.module';
import { MidtransModule } from './midtrans/midtrans.module';
import { Payment } from './payment/payment.entity';
import { PaymentModule } from './payment/payment.module';
import { PaymentZenpres } from './paymentZenpres/paymentZenpres.entity';
import { PaymentZenpresModule } from './paymentZenpres/paymentZenpres.module';

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
    entities: [Payment, PaymentZenpres],
    logging: Boolean(process.env.TYPEORM_LOGGING),
    synchronize: false,
    migrationsRun: true,
    migrations: [migrations.InitPayment1561546502902],
  };

  @Module({
    imports: [
      TypeOrmModule.forRoot(dbConfig),
      PaymentModule,
      MidtransModule,
      PaymentZenpresModule,
      FileStorageModule,
    ],
  })
  class AppModule {}

  return AppModule;
}
