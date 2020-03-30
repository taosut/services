import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRequest } from '@nestjsx/crud';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { getConnection, Repository } from 'typeorm';
import { ContentInvokeService } from '../../services/content.service';
import RedisService from '../../services/redis.service';
import { Answer } from './answer/answer.entity';
import { CreateManyQuestionWithAnswerDto } from './question.dto';
import { Question } from './question.entity';

@Injectable()
export class QuestionService extends TypeOrmCrudService<Question> {
  constructor(
    @InjectRepository(Question) repo: Repository<Question>,
    protected readonly contentInvokeService: ContentInvokeService,
    private readonly redisService: RedisService
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

  async softDelete(id: string): Promise<Question> {
    const oldData = await this.repo.findOne({ id });
    if (!oldData) {
      return Promise.reject({
        statusCode: 404,
        message: 'Question is not exist',
      });
    }
    if (oldData.deleted_at) {
      return Promise.reject({
        statusCode: 404,
        message: 'Question is already in the trash',
      });
    }

    const updated: Question = Object.assign(oldData, {
      deleted_at: new Date(Date.now()),
    });
    return this.repo
      .save(updated)
      .then(res => Promise.resolve(res))
      .catch(error => Promise.reject(error));
  }

  async restore(id: string): Promise<Question> {
    const oldData = await this.repo.findOne({ id });
    if (!oldData) {
      return Promise.reject({
        statusCode: 404,
        message: 'Question is not exist',
      });
    }
    if (!oldData.deleted_at) {
      return Promise.reject({
        statusCode: 404,
        message: 'Question cannot be found in the trash',
      });
    }

    const updated: Question = Object.assign(oldData, { deleted_at: null });
    return this.repo
      .save(updated)
      .then(res => Promise.resolve(res))
      .catch(error => Promise.reject(error));
  }

  async createManyWithAnswer(
    dto: CreateManyQuestionWithAnswerDto
  ): Promise<any> {
    const tempQuestions: any[] = dto.bulk;
    const questions: any[] = [];
    // get a connection and create a new query runner
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    const answerRepo = connection.getRepository(Answer);

    // establish real database connection using our new query runner
    await queryRunner.connect();

    // lets now open a new transaction:
    await queryRunner.startTransaction();

    try {
      for (const question of tempQuestions) {
        const tmpQuestion: any = question;
        const resQuestion: any = {
          ...question,
          answers: [],
        };
        const questionCreated: any = await this.repo.create(tmpQuestion);
        const questionSaved: any = await this.repo.save(questionCreated);
        for (const answer of tmpQuestion.answers) {
          const tmpAnswer = {
            ...answer,
            question_id: questionSaved.id,
          };
          const answerCreated: any = await answerRepo.create(tmpAnswer);
          const answerSaved: any = await answerRepo.save(answerCreated);
          resQuestion.answers.push(answerSaved);
        }
        questions.push(resQuestion);
      }

      // commit transaction now:
      await queryRunner.commitTransaction();
      return { bulk: questions };
    } catch (err) {
      Logger.error(`ROLLBACK ${JSON.stringify(err)}`);
      // since we have errors lets rollback changes we made
      await queryRunner.rollbackTransaction();
    } finally {
      const containsExam = ['byMeta'];
      for (const item of dto.bulk) {
        if (item.exam_id && !containsExam.find(el => el === item.exam_id)) {
          containsExam.push(item.exam_id);
        }
      }
      await this.redisService.clearCache('*exam*', containsExam);
      await this.redisService.clearCache('*question*');

      // you need to release query runner which is manually created:
      await queryRunner.release();
    }
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
      if (question.answers) {
        for (const index in question.answers) {
          if (question.answers[index]) {
            if (question.answers[index].image_id) {
              const image_content = await this.contentInvokeService.findOne(
                question.answers[index].image_id,
                {},
                headers
              );
              question.answers[index] = {
                ...question.answers[index],
                image_content,
              };
            }
            if (question.answers[index].video_id) {
              const video_content = await this.contentInvokeService.findOne(
                question.answers[index].video_id,
                {},
                headers
              );
              question.answers[index] = {
                ...question.answers[index],
                video_content,
              };
            }
          }
        }
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

  async createOne(req: CrudRequest, dto: Question): Promise<Question> {
    const containsExam = ['byMeta'];
    if (dto.exam_id) {
      containsExam.push(dto.exam_id);
    }
    await this.redisService.clearCache('*exam*', containsExam);
    await this.redisService.clearCache('*question*');
    return await super.createOne(req, dto);
  }

  async updateOne(req: CrudRequest, dto: Question): Promise<Question> {
    const filterId = req.parsed.paramsFilter.find(item => item.field === 'id');
    let questionId;
    if (filterId) {
      questionId = filterId.value;
    }
    const containsExam = ['byMeta'];
    if (dto.exam_id) {
      containsExam.push(dto.exam_id);
    }
    await this.redisService.clearCache('*exam*', containsExam);
    await this.redisService.clearCache('*question*', [questionId]);
    return await super.updateOne(req, dto);
  }

  async replaceOne(req: CrudRequest, dto: Question): Promise<Question> {
    const filterId = req.parsed.paramsFilter.find(item => item.field === 'id');
    let questionId;
    if (filterId) {
      questionId = filterId.value;
    }
    const containsExam = ['byMeta'];
    if (dto.exam_id) {
      containsExam.push(dto.exam_id);
    }
    await this.redisService.clearCache('*exam*', containsExam);
    await this.redisService.clearCache('*question*', [questionId]);
    return await super.replaceOne(req, dto);
  }

  async deleteOne(req: CrudRequest): Promise<void | Question> {
    const filterId = req.parsed.paramsFilter.find(item => item.field === 'id');
    let questionId;
    if (filterId) {
      questionId = filterId.value;
    }
    const containsExam = ['byMeta'];
    const question = await this.repo.findOne(questionId);
    if (question) {
      containsExam.push(question.exam_id);
    }
    await this.redisService.clearCache('*exam*', containsExam);
    await this.redisService.clearCache('*question*', [questionId]);
    return await super.deleteOne(req);
  }
}
