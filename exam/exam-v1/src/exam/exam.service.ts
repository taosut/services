import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRequest } from '@nestjsx/crud';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { ContentInvokeService } from '../services/content.service';
import RedisService from '../services/redis.service';
import { Exam } from './exam.entity';
import { ExamType } from './examType.enum';

@Injectable()
export class ExamService extends TypeOrmCrudService<Exam> {
  constructor(
    @InjectRepository(Exam) repo: Repository<Exam>,
    protected readonly contentInvokeService: ContentInvokeService,
    private readonly redisService: RedisService
  ) {
    super(repo);
  }

  async findExam(query: {
    type?: string;
    class_id?: string;
    track_id?: string;
    unit_id?: string;
  }): Promise<any> {
    try {
      const queries: string[] = [];
      let queryString: string = '';
      let queryType: string = '';
      if (query.type && query.type.toUpperCase() === ExamType.PRETEST) {
        queryType = ` type="${ExamType.PRETEST}" AND `;
      }
      if (query.class_id) {
        const tmpQuery = `JSON_CONTAINS(exams.meta->"$.class_id", '"${query.class_id}"')`;
        queries.push(tmpQuery);
      }
      if (query.track_id) {
        const tmpQuery = `JSON_CONTAINS(exams.meta->"$.track_id", '"${query.track_id}"')`;
        queries.push(tmpQuery);
      }
      if (query.unit_id) {
        const tmpQuery = `JSON_CONTAINS(exams.meta->"$.unit_id", '"${query.unit_id}"')`;
        queries.push(tmpQuery);
      }
      queryString = queries.join(' AND ');
      const exams: Exam[] = await this.repo
        .createQueryBuilder('exams')
        .where(queryType + queryString)
        .getMany();
      return exams;
    } catch (err) {
      return Promise.reject(err);
    }
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

  async publish(id: string): Promise<Exam> {
    const oldData = await this.repo.findOne({
      where: { id },
      relations: ['questions', 'questions.answers'],
    });
    if (!oldData) {
      return Promise.reject({ statusCode: 404, message: 'Exam is not exist' });
    }
    // check is can publish??
    if (oldData.questions.length === 0) {
      return Promise.reject({
        statusCode: 400,
        message: `Question is not exist. Please add question.`,
      });
    }
    for (const question of oldData.questions) {
      if (question.answers.length === 0) {
        return Promise.reject({
          statusCode: 400,
          message: `Answer is not exist in question (ID: ${question.id}). Please add answer.`,
        });
      }
    }
    // end check
    delete oldData.questions;
    const updated: Exam = Object.assign(oldData, { published: true });
    return this.repo
      .save(updated)
      .then(res => Promise.resolve(res))
      .catch(error => Promise.reject(error));
  }

  async resolveContent(question: any, headers: any): Promise<any> {
    try {
      if (question.image_id) {
        question.image_content = await this.contentInvokeService.findOne(
          question.image_id,
          {},
          headers
        );
      }
      if (question.video_id) {
        question.video_content = await this.contentInvokeService.findOne(
          question.video_id,
          {},
          headers
        );
      }
      return question;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async resolveContents(questions: any, headers: any): Promise<any> {
    try {
      const contentIds: any[] = [];
      for (const question of questions) {
        if (
          question.image_id &&
          !contentIds.find(item => item === question.image_id)
        ) {
          contentIds.push(question.image_id);
        }
        if (
          question.video_id &&
          !contentIds.find(item => item === question.video_id)
        ) {
          contentIds.push(question.video_id);
        }
        if (question.answers) {
          for (const answer of question.answers) {
            if (
              answer.image_id &&
              !contentIds.find(item => item === answer.image_id)
            ) {
              contentIds.push(answer.image_id);
            }
            if (
              answer.video_id &&
              !contentIds.find(item => item === answer.video_id)
            ) {
              contentIds.push(answer.video_id);
            }
          }
        }
      }

      if (contentIds.length > 0) {
        let contentsData = [];
        const contents = await this.contentInvokeService.find(
          {
            filter: `id||in||${contentIds.join(',')}`,
          },
          headers
        );
        if (!contents) {
          contentsData = [];
        } else if (contents && contents.data) {
          contentsData = contents.data;
        } else {
          contentsData = contents;
        }
        if (contentsData.length > 0) {
          questions = questions.map(item => {
            if (item.image_id) {
              const findContent = contentsData.find(el => el.id === item.image_id);
              item = {
                ...item,
                image_content: findContent,
              };
            }
            if (item.video_id) {
              const findContent = contentsData.find(el => el.id === item.video_id);
              item = {
                ...item,
                video_content: findContent,
              };
            }
            if (item.answers) {
              item.answers = item.answers.map(itemAnswer => {
                if (itemAnswer.image_id) {
                  const findContent = contentsData.find(
                    el => el.id === itemAnswer.image_id
                  );
                  itemAnswer = {
                    ...itemAnswer,
                    image_content: findContent,
                  };
                }
                if (itemAnswer.video_id) {
                  const findContent = contentsData.find(
                    el => el.id === itemAnswer.video_id
                  );
                  itemAnswer = {
                    ...itemAnswer,
                    video_content: findContent,
                  };
                }
                return itemAnswer;
              });
            }
            return item;
          });
        }
      }
      return questions;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async createOne(req: CrudRequest, dto: Exam): Promise<Exam> {
    await this.redisService.clearCache('*exam*', [dto.meta.unit_id, 'byMeta']);
    return await super.createOne(req, dto);
  }

  async updateOne(req: CrudRequest, dto: Exam): Promise<Exam> {
    const filterId = req.parsed.paramsFilter.find(item => item.field === 'id');
    let examId;
    if (filterId) {
      examId = filterId.value;
    }
    await this.redisService.clearCache('*exam*', [examId, 'byMeta']);
    return await super.updateOne(req, dto);
  }

  async replaceOne(req: CrudRequest, dto: Exam): Promise<Exam> {
    const filterId = req.parsed.paramsFilter.find(item => item.field === 'id');
    let examId;
    if (filterId) {
      examId = filterId.value;
    }
    await this.redisService.clearCache('*exam*', [examId, 'byMeta']);
    return await super.replaceOne(req, dto);
  }

  async deleteOne(req: CrudRequest): Promise<void | Exam> {
    const filterId = req.parsed.paramsFilter.find(item => item.field === 'id');
    let examId;
    if (filterId) {
      examId = filterId.value;
    }
    await this.redisService.clearCache('*exam*', [examId]);
    return await super.deleteOne(req);
  }
}
