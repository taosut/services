import { TypeOrmModule } from '@nestjs/typeorm';
import dotenv = require('dotenv');
import { Subscription } from '../src/subscription/subscription.entity';
import { SubscriptionModule } from '../src/subscription/subscription.module';

const { parsed } = dotenv.config({
  path: process.cwd() + '/.env',
});
process.env = { ...parsed, ...process.env };

export const ormconfig = {
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      entities: [Subscription],
      synchronize: true,
    }),
    SubscriptionModule,
  ],
};
