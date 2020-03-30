import { ExceptionHandler } from '@magishift/util';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiImplicitFile,
  ApiOperation,
  ApiUseTags,
} from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';
import { IFile } from '../fileStorage/interfaces/fileStorage.interface';
import { IPaymentZenpresPayload } from './interfaces/paymentPayloadZenpres.interface';
import { IPaymentZenpres } from './interfaces/paymentZenpres.interface';
import { PaymentZenpresService } from './paymentZenpres.service';

@Controller('paymentZenpres')
@ApiUseTags()
export class PaymentZenpresController {
  constructor(private readonly service: PaymentZenpresService) {}
  @Get()
  @ApiOperation({
    title: 'Use to find all payments',
  })
  async findAllPayment(): Promise<IPaymentZenpres[]> {
    try {
      const result = await this.service.findAll();
      return result;
    } catch (e) {
      return ExceptionHandler(e);
    }
  }
  @Post()
  @ApiOperation({
    title: 'Use to create new payment',
  })
  async createPayment(
    @Body() payment: IPaymentZenpresPayload,
  ): Promise<IPaymentZenpres> {
    try {
      const result = await this.service.create(payment);
      return result;
    } catch (e) {
      return ExceptionHandler(e);
    }
  }

  @Post('receipt/:id')
  @ApiOperation({
    title: 'Use to upload manual payment document receipt',
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiImplicitFile({
    name: 'file',
    required: true,
  })
  async uploadReceipt(
    @Param('id') id: string,
    @UploadedFile() file: IFile,
  ): Promise<IPaymentZenpres> {
    const fileName = `payment_receipt_${id}`;
    const result = await this.service.uploadReceipt(file, fileName, id);
    return result;
  }

  @Delete('receipt/:id')
  @ApiOperation({
    title: 'Use to delete manual payment document receipt',
  })
  async deleteReceipt(
    @Param('id') id: string,
  ): Promise<IPaymentZenpres> {
    const fileName = `payment_receipt_${id}`;
    const result = await this.service.deleteReceipt(fileName, id);
    return result;
  }

  @Post('approve/:id')
  @ApiOperation({ title: 'Approve manual payment status to settled' })
  async approve(@Param('id') id: string): Promise<IPaymentZenpres> {
    return await this.service.approve(id);
  }

  @Get(':id')
  @ApiOperation({ title: 'Fetch Payment by its Id' })
  async fetch(@Param('id') id: string): Promise<IPaymentZenpres> {
    try {
      const result = await this.service.fetch(id);
      return result;
    } catch (e) {
      return ExceptionHandler(e);
    }
  }

  @Delete(':id')
  async forceDelete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.service.forceDelete(id);
  }
}
