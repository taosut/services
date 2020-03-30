import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmsConfigurationController } from './smsConfiguration.controller';
import { SmsConfiguration } from './smsConfiguration.entity';
import { SmsConfigurationService } from './smsConfiguration.service';

@Module({
  imports: [TypeOrmModule.forFeature([SmsConfiguration])],
  providers: [SmsConfigurationService],
  controllers: [SmsConfigurationController],
  exports: [SmsConfigurationService],
})
export class SmsConfigurationModule {}
