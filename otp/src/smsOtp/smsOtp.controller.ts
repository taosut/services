import { ExceptionHandler } from '@magishift/util';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { SMS_OTP_ENDPOINT } from './interfaces/smsOtp.const';
import { ISmsOtp } from './interfaces/smsOtp.interface';
import { ISmsOtpCreatePayload } from './interfaces/smsOtpCreatePayload.interface';
import { ISmsOtpUpdatePayload } from './interfaces/smsOtpUpdatePayload.interface';
import { SmsOtpService } from './smsOtp.service';

@Controller(SMS_OTP_ENDPOINT)
export class SmsOtpController {
  constructor(private readonly service: SmsOtpService) {}
  @Get()
  async findAll(): Promise<ISmsOtp[]> {
    try {
      const result = await this.service.findAll();
      return result;
    } catch (e) {
      return ExceptionHandler(e);
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<ISmsOtp> {
    try {
      const result = await this.service.findById(id);
      return result;
    } catch (e) {
      return ExceptionHandler(e);
    }
  }

  @Post('validate/:phonenumber/:otp')
  async validateSmsOtp(
    @Param('phonenumber') phonenumber: string,
    @Param('otp') otp: string
  ): Promise<boolean> {
    try {
      const result = await this.service.validateSmsOtp(phonenumber, otp);
      return result;
    } catch (e) {
      return ExceptionHandler(e);
    }
  }

  @Post('send-otp/:phonenumber')
  async sendOtp(@Param('phonenumber') phonenumber: string): Promise<object> {
    try {
      const result = await this.service.sendSmsOtp(phonenumber);
      return result;
    } catch (e) {
      return ExceptionHandler(e);
    }
  }

  @Post()
  async create(@Body() data: ISmsOtpCreatePayload): Promise<ISmsOtp> {
    try {
      const result = await this.service.create(data);
      return result;
    } catch (e) {
      return ExceptionHandler(e);
    }
  }

  @Patch(':id')
  async update(
    @Param() { id },
    @Body() data: ISmsOtpUpdatePayload
  ): Promise<ISmsOtp> {
    return await this.service.update(id, data);
  }

  // @Patch('delete/:id')
  // async delete(@Param() { id }): Promise<ISmsOtp> {
  //   return await this.service.delete(id);
  // }

  @Delete(':id')
  async forceDelete(@Param() { id }): Promise<DeleteResult> {
    return await this.service.forceDelete(id);
  }
}
