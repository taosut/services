import { ExceptionHandler } from '@magishift/util';
import { Controller, Get, Post, Body } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { ApiUseTags } from '@nestjs/swagger';
import { IPurchasePayload, IPurchase } from './interfaces/purchase.interface';

@Controller('purchase')
@ApiUseTags()
export class PurchaseController {
  constructor(private readonly service: PurchaseService) {}
  @Get()
  async findAllPurchase(): Promise<IPurchase[]> {
    try {
      const result = await this.service.findAll();
      return result;
    } catch (e) {
      return ExceptionHandler(e);
    }
  }
  @Post()
  async createPurchase(@Body() purchase: IPurchasePayload): Promise<IPurchase> {
    try {
      const result = await this.service.create(purchase);
      return result;
    } catch (e) {
      return ExceptionHandler(e);
    }
  }
}
