import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseUser } from '../../../models/courseuser/courseuser.entity';
import { Repository } from 'typeorm';
import { ICourseUser } from '../../../models/courseuser/courseuser.interface';
import { data } from './data';
/**
 * Service dealing with courseuser based operations.
 *
 * @class
 */
@Injectable()
export class CourseUserSeederService {
  /**
   * Create an instance of class.
   *
   * @constructs
   *
   * @param {Repository<CourseUser>} courseuserRepository
   */
  constructor(
    @InjectRepository(CourseUser)
    private readonly courseuserRepository: Repository<CourseUser>,
  ) {}
  /**
   * Seed all courseusers.
   *
   * @function
   */
  create(): Array<Promise<CourseUser>> {
    return data.map(async (courseuser: ICourseUser) => {
      return await this.courseuserRepository
        .findOne({ id: courseuser.id })
        // .exec()
        .then(async dbCourseUser => {
          // We check if a courseuser already exists.
          // If it does don't create a new one.
          if (dbCourseUser) {
            return Promise.resolve(null);
          }
          return Promise.resolve(
            await this.courseuserRepository.save(courseuser),
          );
        })
        .catch(error => Promise.reject(error));
    });
  }
}
