import { Injectable, HttpException } from '@nestjs/common';
import { IPurchase, IPurchasePayload } from './interfaces/purchase.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Purchase } from './purchase.entity';
import { Repository } from 'typeorm';
import * as _ from 'lodash';
import { IPurchaseService } from './interfaces/purchaseService.interface';

@Injectable()
export class PurchaseService implements IPurchaseService {
  constructor(
    @InjectRepository(Purchase)
    protected readonly repository: Repository<Purchase>,
  ) {}

  async create(data: IPurchasePayload): Promise<IPurchase> {
    // tslint:disable-next-line:no-console
    console.log(data);
    if (_.isEmpty(data)) {
      throw new Error('Cannot create Empty data');
    }
    const entity = await this.repository.create(data);

    const result = await this.repository.save(entity);
    return result;
  }

  async update(id: string, data: IPurchasePayload): Promise<IPurchase> {
    const found = await this.repository.findOne({ id });
    if (!found) {
      throw new HttpException('Purchase Id not registered', 404);
    }

    const entity = await this.repository.update(id, data);
    if (!entity) {
      throw new HttpException('Failed to Update Purchase', 400);
    }

    const result = await this.repository.findOne({ id });
    return result;
  }

  async fetch(id: string): Promise<IPurchase> {
    const result = await this.repository.findOne({ id });

    return result;
  }

  async findAll(): Promise<IPurchase[]> {
    const result = await this.repository
      .createQueryBuilder('purchase')
      .orderBy('purchase.createdAt', 'ASC')
      .limit(10)
      .getMany();

    return result;
  }
}
