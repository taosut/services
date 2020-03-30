import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRequest, GetManyDefaultResponse } from '@nestjsx/crud';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { QuestionService } from '../question.service';
import { Answer } from './answer.entity';

@Injectable()
export class AnswerService extends TypeOrmCrudService<Answer> {
  constructor(
    @InjectRepository(Answer) repo: Repository<Answer>,
    private questionService: QuestionService
  ) {
    super(repo);
  }

  async getList(
    req: CrudRequest,
    questionId: string
  ): Promise<GetManyDefaultResponse<Answer> | Answer[]> {
    try {
      const isExist = await this.questionService.findOne({ id: questionId });
      if (!isExist) {
        return Promise.reject({ statusCode: 404, message: 'Not found' });
      } else if (isExist && isExist.deleted_at) {
        return Promise.reject({
          statusCode: 404,
          message: 'Question has been moved to trash',
        });
      }
      return this.getMany(req);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
