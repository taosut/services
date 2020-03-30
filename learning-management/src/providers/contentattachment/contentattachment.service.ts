import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContentAttachment } from '../../models/contentattachment/contentattachment.entity';
import { Repository, DeleteResult } from 'typeorm';
import { IContentAttachment } from '../../models/contentattachment/contentattachment.interface';
/**
 * Service dealing with contentattachment based operations.
 *
 * @class
 */
@Injectable()
export class ContentAttachmentService {
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
   * Find a contentattachment
   *
   * @function
   */
  findOne(where: object = {}): Promise<ContentAttachment> {
    where = {
      ...where,
      deleted_at: null,
    };
    return this.contentattachmentRepository.findOne({where, relations: ['content']});
  }
  /**
   * Find a contentattachment
   *
   * @function
   */
  findOneWithTrash(where: object = {}): Promise<ContentAttachment> {
    return this.contentattachmentRepository.findOne({where, relations: ['content']});
  }

  /**
   * Create a contentattachment
   *
   * @function
   */
  create(contentattachment: ContentAttachment): Promise<ContentAttachment> {
    return this.contentattachmentRepository
      .findOne({ id: contentattachment.id })
      // .exec()
      .then(async dbContentAttachment => {
        // We check if a contentattachment already exists.
        // If it does don't create a new one.
        if (dbContentAttachment) {
          return Promise.reject({message: 'ContentAttachment is already exist ' + dbContentAttachment.deleted_at ? '' : 'in the trash'});
        }
        return Promise.resolve(
          await this.contentattachmentRepository.save(contentattachment),
        );
      })
      .catch(error => Promise.reject(error));
  }
  /**
   * Seed all content_attachments.
   *
   * @function
   */
  createMultiple(contentAttachments: ContentAttachment[]): Array<Promise<ContentAttachment>> {
    return contentAttachments.map(async (contentattachment: IContentAttachment) => {
      return await this.contentattachmentRepository
        .findOne({ id: contentattachment.id })
        // .exec()
        .then(async dbContentAttachment => {
          // We check if a contentattachment already exists.
          // If it does don't create a new one.
          if (dbContentAttachment) {
            return Promise.reject({message: 'ContentAttachment is already exist ' + dbContentAttachment.deleted_at ? '' : 'in the trash'});
          }
          return Promise.resolve(
            await this.contentattachmentRepository.save(contentattachment),
          );
        })
        .catch(error => Promise.reject(error));
    });
  }

  /**
   * Delete a contentattachment
   *
   * @function
   */
  async forceDelete(id: string): Promise<ContentAttachment | DeleteResult> {
    const oldData = await this.contentattachmentRepository.findOne({ id });
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'ContentAttachment is not exist'});
    }

    return this.contentattachmentRepository.delete({id})
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }
}
