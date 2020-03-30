import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { getConnection, Repository } from 'typeorm';
import { Answer } from './answer/answer.entity';
import { CreateManyQuestionWithAnswerDto } from './question.dto';
import { Question } from './question.entity';

@Injectable()
export class QuestionService extends TypeOrmCrudService<Question> {
  constructor(@InjectRepository(Question) repo: Repository<Question>) {
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
      // you need to release query runner which is manually created:
      await queryRunner.release();
    }
  }
}
