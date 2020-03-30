import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import RedisService from '../services/redis.service';
import { SubscriptionController } from './subscription.controller';
import { Subscription } from './subscription.entity';
import { SubscriptionService } from './subscription.service';
@Module({
  imports: [TypeOrmModule.forFeature([Subscription])],
  providers: [SubscriptionService, RedisService],
  controllers: [SubscriptionController],
  exports: [SubscriptionService],
})
export class SubscriptionModule { }
