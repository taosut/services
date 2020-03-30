import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { AttemptDetail } from './attemptDetail.entity';

@Injectable()
export class AttemptDetailService extends TypeOrmCrudService<AttemptDetail> {
  constructor(
    @InjectRepository(AttemptDetail) repo: Repository<AttemptDetail>
  ) {
    super(repo);
  }

  async create(body: any): Promise<any> {
    try {
      const bodyCreated = await this.repo.create(body);
      const result = await this.repo.save(bodyCreated);
      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async update(id: string, body: any): Promise<any> {
    try {
      return await this.repo.update(id, body);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async delete(ids: string | string[]): Promise<any> {
    try {
      return await this.repo.delete(ids);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
