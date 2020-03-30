import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRequest } from '@nestjsx/crud';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import RedisService from '../services/redis.service';
import { Subscription } from './subscription.entity';
@Injectable()
export class SubscriptionService extends TypeOrmCrudService<
Subscription
> {
  constructor(
    @InjectRepository(Subscription) repo: Repository<Subscription>,
    private readonly redisService: RedisService
  ) {
    super(repo);
  }
  async getSubscriptionByAccount(account_id: string): Promise<Subscription> {
    try {
      const res = await this.repo.findOne({
        where: { account_id },
        order: {
          expired: 'DESC',
        },
      });
      if (res.expired < new Date()) {
        throw new HttpException('Expired', 400);
      }
      await this.redisService.clearCache('*subscription*', [account_id]);
      return res;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async createOne(req: CrudRequest, dto: Subscription): Promise<Subscription> {
    await this.redisService.clearCache('*subscription*');
    return await super.createOne(req, dto);
  }

  async updateOne(req: CrudRequest, dto: Subscription): Promise<Subscription> {
    const filterId = req.parsed.paramsFilter.find(item => item.field === 'id');
    let id: string;
    if (filterId) {
      id = filterId.value;
    }
    await this.redisService.clearCache('*subscription*', [id]);
    return await super.updateOne(req, dto);
  }

  async deleteOne(req: CrudRequest): Promise<void | Subscription> {
    const filterId = req.parsed.paramsFilter.find(item => item.field === 'id');
    let id: string;
    if (filterId) {
      id = filterId.value;
    }
    await this.redisService.clearCache('*subscription*', [id]);
    return await super.deleteOne(req);
  }
}
