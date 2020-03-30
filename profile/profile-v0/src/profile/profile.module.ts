import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountService } from '../services/account.service';
import AWSInvoker from '../services/invoker.service';
import RedisService from '../services/redis.service';
// import { FileService } from '../services/file.service';
import { ProfileController } from './profile.controller';
import { Profile } from './profile.entity';
import { ProfileService } from './profile.service';

@Module({
  imports: [TypeOrmModule.forFeature([Profile])],
  providers: [
    ProfileService,
    AccountService,
    // FileService,
    AWSInvoker,
    RedisService,
  ],
  controllers: [ProfileController],
  exports: [ProfileService],
})
export class ProfileModule {}
