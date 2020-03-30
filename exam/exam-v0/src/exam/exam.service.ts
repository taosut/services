import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Exam } from './exam.entity';

@Injectable()
export class ExamService extends TypeOrmCrudService<Exam> {
  constructor(@InjectRepository(Exam) repo: Repository<Exam>) {
    super(repo);
  }

  async softDelete(id: string): Promise<Exam | DeleteResult> {
    const oldData = await this.repo.findOne({ id });
    if (!oldData) {
      return Promise.reject({ statusCode: 404, message: 'Exam is not exist' });
    }
    if (oldData.deleted_at) {
      return Promise.reject({
        statusCode: 404,
        message: 'Exam is already in the trash',
      });
    }

    const updated: Exam = Object.assign(oldData, {
      deleted_at: new Date(Date.now()),
    });
    return this.repo
      .save(updated)
      .then(res => Promise.resolve(res))
      .catch(error => Promise.reject(error));
  }

  async restore(id: string): Promise<Exam> {
    const oldData = await this.repo.findOne({ id });
    if (!oldData) {
      return Promise.reject({ statusCode: 404, message: 'Exam is not exist' });
    }
    if (!oldData.deleted_at) {
      return Promise.reject({
        statusCode: 404,
        message: 'Exam cannot be found in the trash',
      });
    }

    const updated: Exam = Object.assign(oldData, { deleted_at: null });
    return this.repo
      .save(updated)
      .then(res => Promise.resolve(res))
      .catch(error => Promise.reject(error));
  }
}
