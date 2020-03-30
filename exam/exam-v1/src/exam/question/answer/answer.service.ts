import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRequest, GetManyDefaultResponse } from '@nestjsx/crud';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { ContentInvokeService } from '../../../services/content.service';
import RedisService from '../../../services/redis.service';
import { QuestionService } from '../question.service';
import { Answer } from './answer.entity';

@Injectable()
export class AnswerService extends TypeOrmCrudService<Answer> {
  constructor(
    @InjectRepository(Answer) repo: Repository<Answer>,
    private questionService: QuestionService,
    protected readonly contentInvokeService: ContentInvokeService,
    private readonly redisService: RedisService
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

  async resolveContent(answer: any, headers: any): Promise<any> {
    try {
      if (answer.image_id) {
        answer.image_content = await this.contentInvokeService.findOne(
          answer.image_id,
          {},
          headers
        );
      }
      if (answer.video_id) {
        answer.video_content = await this.contentInvokeService.findOne(
          answer.video_id,
          {},
          headers
        );
      }
      return answer;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async createOne(req: CrudRequest, dto: Answer): Promise<Answer> {
    await this.redisService.clearCache('*question*', [dto.question_id]);
    await this.redisService.clearCache('*answer*');
    return await super.createOne(req, dto);
  }

  async updateOne(req: CrudRequest, dto: Answer): Promise<Answer> {
    const filterId = req.parsed.paramsFilter.find(item => item.field === 'id');
    let answerId;
    if (filterId) {
      answerId = filterId.value;
    }
    await this.redisService.clearCache('*question*', [dto.question_id]);
    await this.redisService.clearCache('*answer*', [answerId, dto.question_id]);
    return await super.updateOne(req, dto);
  }

  async replaceOne(req: CrudRequest, dto: Answer): Promise<Answer> {
    const filterId = req.parsed.paramsFilter.find(item => item.field === 'id');
    let answerId;
    if (filterId) {
      answerId = filterId.value;
    }
    await this.redisService.clearCache('*question*', [dto.question_id]);
    await this.redisService.clearCache('*answer*', [answerId, dto.question_id]);
    return await super.replaceOne(req, dto);
  }

  async deleteOne(req: CrudRequest): Promise<void | Answer> {
    const filterId = req.parsed.paramsFilter.find(item => item.field === 'id');
    let answerId;
    if (filterId) {
      answerId = filterId.value;
    }
    const containsQuestion = ['byMeta'];
    const answer = await this.repo.findOne(answerId);
    if (answer) {
      containsQuestion.push(answer.question_id);
    }
    await this.redisService.clearCache('*question*', containsQuestion);
    await this.redisService.clearCache('*answer*', [answerId]);
    return await super.deleteOne(req);
  }
}
