import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassInvokeService } from '../../services/invokes/class.service';
import { AccountModule } from './account/account.module';
import { BaseController } from './base.controller';
import { ChannelController } from './channel.controller';
import { Channel } from './channel.entity';
import { ChannelService } from './channel.service';

@Module({
  imports: [TypeOrmModule.forFeature([Channel]), AccountModule],
  providers: [ChannelService, ClassInvokeService],
  controllers: [BaseController, ChannelController],
  exports: [ChannelService, ClassInvokeService],
})
export class ChannelModule {}
