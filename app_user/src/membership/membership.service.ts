import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ = require('lodash');
import { DeleteResult, Repository } from 'typeorm';
import {
  IExpirationDate,
  IMembership,
} from './interfaces/membership.interface';
import { IMembershipPayload } from './interfaces/membershipPayload.interface';
import { Membership } from './membership.entity';
import { ProductService } from './product.service';

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(Membership)
    protected readonly repository: Repository<Membership>,
    protected readonly productService: ProductService
  ) {}

  async create(data: IMembershipPayload): Promise<IMembership> {
    if (_.isEmpty(data)) {
      throw new Error('Cannot create Empty data');
    }

    if (!data.productId) {
      throw new Error('Cannot create membership, Please specified Product Id');
    }

    if (!data.user) {
      throw new Error('Cannot create membership, Please specified User Id');
    }

    const userMemberships = await this.findAllActiveMembershipByUserId(
      data.user.id
    );

    let latestMembership = null;

    if (userMemberships.length > 0) {
      latestMembership = await this.getLatestMembership(userMemberships);
    }

    const membership = (data as any) as IMembership;
    const expiration = await this.generateExpiredDate(data, latestMembership);
    membership.createdAt = new Date();
    membership.activatedAt = expiration.activatedAt;
    membership.expiredAt = expiration.expiredAt;

    const entity = await this.repository.create(membership);

    const result = await this.repository.save(entity);

    return result;
  }

  async update(id: string, data: IMembershipPayload): Promise<IMembership> {
    const found = await this.repository.findOne({ id });
    if (!found) {
      throw new HttpException('Membership Id not registered', 404);
    }

    const entity = await this.repository.update(id, data);
    if (!entity) {
      throw new HttpException('Failed to Update Membership', 400);
    }

    const result = await this.fetch(id);
    return result;
  }

  async fetch(id: string): Promise<IMembership> {
    const result = await this.repository.findOne({ id });

    if (!result) {
      throw new HttpException('Membership Not Found', 404);
    }

    return result;
  }

  async delete(id: string): Promise<IMembership> {
    try {
      await this.repository.update(id, { isDeleted: true });
    } catch (e) {
      throw new HttpException('Error Deleting Membership', 404);
    }

    return await this.fetch(id);
  }

  async forceDelete(id: string): Promise<DeleteResult> {
    return await this.repository.delete(id);
  }

  async findAll(): Promise<IMembership[]> {
    const result = await this.repository
      .createQueryBuilder()
      .where('isDeleted = FALSE')
      .orderBy('createdAt', 'ASC')
      .limit(10)
      .getMany();

    return result;
  }

  async findAllActiveMembershipByUserId(
    userId: string
  ): Promise<IMembership[]> {
    const now = new Date();
    const newDate = new Date(now.setMinutes(now.getMinutes() + 1));
    const expireDate = newDate.toISOString() as any;
    const result = await this.repository
      .createQueryBuilder()
      .where('isDeleted = FALSE')
      .andWhere('userId = :userId', {
        userId,
      })
      .andWhere('expiredAt > :expireDate', {
        expireDate,
      })
      .getMany();

    return result;
  }

  private async getLatestMembership(
    memberships: IMembership[]
  ): Promise<IMembership> {
    let latestExpireDate = new Date();
    let latestMembership = null as IMembership;
    for (const membership of memberships) {
      if (latestExpireDate < membership.expiredAt) {
        latestExpireDate = membership.expiredAt;
        latestMembership = membership;
      }
    }

    return latestMembership;
  }

  private async generateExpiredDate(
    data: IMembershipPayload,
    latestActiveMembership: IMembership
  ): Promise<IExpirationDate> {
    const product = await this.productService.getProductByProductId(
      data.productType,
      data.productId
    );

    if (!product.period) {
      throw new HttpException(`Product period not found or null`, 404);
    }

    return await this.calculateNewExpirationDate(
      product.period,
      latestActiveMembership
    );
  }

  private async calculateNewExpirationDate(
    productPeriod: number,
    latestActiveMembership: IMembership
  ): Promise<IExpirationDate> {
    const activatedAt = latestActiveMembership
      ? latestActiveMembership.expiredAt
      : new Date();
    const expiredAt = new Date(
      activatedAt.setMinutes(activatedAt.getMinutes() + productPeriod)
    );
    return { activatedAt, expiredAt };
  }
}
