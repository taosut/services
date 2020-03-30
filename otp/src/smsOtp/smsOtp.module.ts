import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmsConfigurationModule } from '../smsConfiguration/smsConfiguration.module';
import { SmsOtpController } from './smsOtp.controller';
import { SmsOtp } from './smsOtp.entity';
import { SmsOtpService } from './smsOtp.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SmsOtp]),
    HttpModule,
    SmsConfigurationModule,
  ],
  providers: [SmsOtpService],
  controllers: [SmsOtpController],
  exports: [SmsOtpService],
})
export class SmsOtpModule {}
