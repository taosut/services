import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from '../../../models/lesson/lesson.entity';
import { Repository } from 'typeorm';
import { ILesson } from '../../../models/lesson/lesson.interface';
import { data } from './data';
/**
 * Service dealing with lesson based operations.
 *
 * @class
 */
@Injectable()
export class LessonSeederService {
  /**
   * Create an instance of class.
   *
   * @constructs
   *
   * @param {Repository<Lesson>} lessonRepository
   */
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
  ) {}
  /**
   * Seed all lessons.
   *
   * @function
   */
  create(): Array<Promise<Lesson>> {
    return data.map(async (lesson: ILesson) => {
      return await this.lessonRepository
        .findOne({ id: lesson.id })
        // .exec()
        .then(async dbLesson => {
          // We check if a lesson already exists.
          // If it does don't create a new one.
          if (dbLesson) {
            return Promise.resolve(null);
          }
          return Promise.resolve(
            await this.lessonRepository.save(lesson),
          );
        })
        .catch(error => Promise.reject(error));
    });
  }
}
