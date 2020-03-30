import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { ClassMembership } from './classMembership.entity';

@Injectable()
export class ClassMembershipService extends TypeOrmCrudService<
  ClassMembership
> {
  constructor(
    @InjectRepository(ClassMembership) repo: Repository<ClassMembership>
  ) {
    super(repo);
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

  async joinMembership(classId: string, userId: string): Promise<any> {
    try {
      let membership: Partial<ClassMembership> = await this.repo.findOne({
        where: { user_id: userId, class_id: classId },
      });
      if (!membership) {
        return Promise.reject({ statusCode: 404, message: 'Not found' });
      }
      membership = {
        ...membership,
        has_joined: true,
      };
      return await this.repo.update(membership.id, membership);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
