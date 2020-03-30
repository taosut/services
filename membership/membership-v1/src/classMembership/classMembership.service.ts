import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

import { DeleteResult, Repository } from 'typeorm';
import { CompletionInvokeService } from '../services/completion.service';
import RedisService from '../services/redis.service';
import SNSService from '../services/sns.service';
import { ClassMembership } from './classMembership.entity';

@Injectable()
export class ClassMembershipService extends TypeOrmCrudService<
  ClassMembership
> {
  constructor(
    @InjectRepository(ClassMembership) repo: Repository<ClassMembership>,
    private readonly completionInvokeService: CompletionInvokeService,
    private readonly redisService: RedisService,
    private readonly snsService: SNSService
  ) {
    super(repo);
  }

  async createOneBaseAndGenerateCompletion(
    headers: any,
    dto: Partial<ClassMembership>,
    withCompletion: boolean
  ): Promise<any> {
    const find = await this.repo.findOne({
      where: { user_id: dto.user_id, class_id: dto.class_id },
    });
    if (find) {
      return Promise.reject({
        status: 400,
        message: 'Membership already exist',
      });
    }
    try {
      if (withCompletion) {
        const completion = await this.completionInvokeService.generateInitialCompletion(
          headers,
          dto.user_id,
          dto.class_id
        );
        console.info('completion invoke result', completion);
      }
    } catch (err) {
      return Promise.reject(err);
    }

    await this.redisService.clearCache('*membership*', [dto.user_id]);
    try {
      const created = await this.repo.create(dto);
      const saved = await this.repo.save(created);
      await this.snsService.publish({ ...saved, realm: headers.realm });
      return saved;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async deleteByUserId(userId: string): Promise<DeleteResult> {
    try {
      const memberships = await this.repo.find({ where: { user_id: userId } });
      const ids = memberships.map(item => item.id);
      if (ids.length === 0) {
        return Promise.reject({ statusCode: 404, message: 'Not found' });
      }
      return await this.repo.delete(ids);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async deleteByClassId(classId: string): Promise<DeleteResult> {
    try {
      const memberships = await this.repo.find({
        where: { class_id: classId },
      });
      const ids = memberships.map(item => item.id);
      if (ids.length === 0) {
        return Promise.reject({ statusCode: 404, message: 'Not found' });
      }
      return await this.repo.delete(ids);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async deleteByUserAndClassId(
    userId: string,
    classId: string
  ): Promise<DeleteResult> {
    try {
      const memberships = await this.repo.find({
        where: { user_id: userId, class_id: classId },
      });
      const ids = memberships.map(item => item.id);
      if (ids.length === 0) {
        return Promise.reject({ statusCode: 404, message: 'Not found' });
      }
      return await this.repo.delete(ids);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async joinMembership(
    classId: string,
    userId: string,
    headers: any
  ): Promise<any> {
    try {
      let membership: Partial<ClassMembership> = await this.repo.findOne({
        where: { user_id: userId, class_id: classId },
      });
      if (!membership) {
        // return Promise.reject({ statusCode: 404, message: 'Not found' });
        membership = await this.createOneBaseAndGenerateCompletion(headers, {
          class_id: classId,
          user_id: userId,
          has_joined: false,
        }, true);
      }
      membership = {
        ...membership,
        has_joined: true,
      };
      await this.repo.update(membership.id, membership);
      // delete
      return await this.repo.findOne(membership.id);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
