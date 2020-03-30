import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Content } from '../../../models/content/content.entity';
import { Repository } from 'typeorm';
import { IContent } from '../../../models/content/content.interface';
import { data } from './data';
/**
 * Service dealing with content based operations.
 *
 * @class
 */
@Injectable()
export class ContentSeederService {
  /**
   * Create an instance of class.
   *
   * @constructs
   *
   * @param {Repository<Content>} contentRepository
   */
  constructor(
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>,
  ) {}
  /**
   * Seed all contents.
   *
   * @function
   */
  create(): Array<Promise<Content>> {
    return data.map(async (content: IContent) => {
      return await this.contentRepository
        .findOne({ id: content.id })
        // .exec()
        .then(async dbContent => {
          // We check if a content already exists.
          // If it does don't create a new one.
          if (dbContent) {
            return Promise.resolve(null);
          }
          return Promise.resolve(
            await this.contentRepository.save(content),
          );
        })
        .catch(error => Promise.reject(error));
    });
  }
}
