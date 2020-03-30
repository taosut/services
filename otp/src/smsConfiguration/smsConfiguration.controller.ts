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
import { SMS_CONFIGURATION_ENDPOINT } from './interfaces/smsConfiguration.const';
import { ISmsConfiguration } from './interfaces/smsConfiguration.interface';
import { ISmsConfigurationCreatePayload } from './interfaces/smsConfigurationCreatePayload.interface';
import { ISmsConfigurationUpdatePayload } from './interfaces/smsConfigurationUpdatePayload.interface';
import { SmsConfigurationService } from './smsConfiguration.service';

@Controller(SMS_CONFIGURATION_ENDPOINT)
export class SmsConfigurationController {
  constructor(protected readonly service: SmsConfigurationService) {}

  @Get()
  async findAll(): Promise<ISmsConfiguration[]> {
    try {
      const result = await this.service.findAll();
      return result;
    } catch (e) {
      return ExceptionHandler(e);
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<ISmsConfiguration> {
    try {
      const result = await this.service.findById(id);
      return result;
    } catch (e) {
      return ExceptionHandler(e);
    }
  }

  @Post()
  async create(
    @Body() data: ISmsConfigurationCreatePayload
  ): Promise<ISmsConfiguration> {
    try {
      const result = await this.service.create(data);
      return result;
    } catch (e) {
      return ExceptionHandler(e);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() data: ISmsConfigurationUpdatePayload
  ): Promise<ISmsConfiguration> {
    return await this.service.update(id, data);
  }

  @Delete(':id')
  async forceDelete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.service.forceDelete(id);
  }
}
