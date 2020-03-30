import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContentAttachment } from '../../../models/contentattachment/contentattachment.entity';
import { Repository } from 'typeorm';
import { IContentAttachment } from '../../../models/contentattachment/contentattachment.interface';
import { data } from './data';
/**
 * Service dealing with contentattachment based operations.
 *
 * @class
 */
@Injectable()
export class ContentAttachmentSeederService {
  /**
   * Create an instance of class.
   *
   * @constructs
   *
   * @param {Repository<ContentAttachment>} contentattachmentRepository
   */
  constructor(
    @InjectRepository(ContentAttachment)
    private readonly contentattachmentRepository: Repository<ContentAttachment>,
  ) {}
  /**
   * Seed all contentattachments.
   *
   * @function
   */
  create(): Array<Promise<ContentAttachment>> {
    return data.map(async (contentattachment: IContentAttachment) => {
      return await this.contentattachmentRepository
        .findOne({ id: contentattachment.id })
        // .exec()
        .then(async dbContentAttachment => {
          // We check if a contentattachment already exists.
          // If it does don't create a new one.
          if (dbContentAttachment) {
            return Promise.resolve(null);
          }
          return Promise.resolve(
            await this.contentattachmentRepository.save(contentattachment),
          );
        })
        .catch(error => Promise.reject(error));
    });
  }
}
