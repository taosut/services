import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from '../../../models/course/course.entity';
import { Repository } from 'typeorm';
import { ICourse } from '../../../models/course/course.interface';
import { data } from './data';
/**
 * Service dealing with course based operations.
 *
 * @class
 */
@Injectable()
export class CourseSeederService {
  /**
   * Create an instance of class.
   *
   * @constructs
   *
   * @param {Repository<Course>} courseRepository
   */
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}
  /**
   * Seed all courses.
   *
   * @function
   */
  create(): Array<Promise<Course>> {
    return data.map(async (course: ICourse) => {
      return await this.courseRepository
        .findOne({ id: course.id })
        // .exec()
        .then(async dbCourse => {
          // We check if a course already exists.
          // If it does don't create a new one.
          if (dbCourse) {
            return Promise.resolve(null);
          }
          return Promise.resolve(
            await this.courseRepository.save(course),
          );
        })
        .catch(error => Promise.reject(error));
    });
  }
}
