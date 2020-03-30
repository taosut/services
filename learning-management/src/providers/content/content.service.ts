import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Content } from '../../models/content/content.entity';
import { Repository, DeleteResult, Not, IsNull } from 'typeorm';
import { IContent } from '../../models/content/content.interface';
/**
 * Service dealing with content based operations.
 *
 * @class
 */
@Injectable()
export class ContentService {
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
   * Find all content
   *
   * @function
   */
  async findAll(filters: any = {}): Promise<Content[]> {
    let query = await this.contentRepository.createQueryBuilder('contents');
    if (filters.keyword) {
      query = await query.where('contents.title ILIKE :keyword OR contents.description ILIKE :keyword ', { keyword: '%' + filters.keyword + '%' });
    }
    if (filters.where) {
      for (const prop in filters.where) {
        if (prop === 'deleted_at') {
          query = await query.andWhere('contents.' + prop + ' ' + (filters.where[prop] ? ' IS NOT NULL ' : ' IS NULL '));
        } else if (filters.where[prop] === true || filters.where[prop] === false) {
          query = await query.andWhere('contents.' + prop + ' ' + (filters.where[prop] ? '= true ' : '= false '));
        } else {
          query = await query.andWhere('contents.' + prop + ' = :dfilter ', { dfilter: filters.where[prop] });
        }
      }
    }
    return query.getMany();
  }
  /**
   * Find all content with pagination
   *
   * @function
   */
  async findAllWithPagination(filters: any = {}): Promise<Content[]> {
    let page = 1;
    let perPage = 5;
    if (filters.page) { page = filters.page; }
    if (filters.per_page) { perPage = filters.per_page; }

    let query = await this.contentRepository
                  .createQueryBuilder('contents');

    if (filters.keyword) {
      query = await query.where('contents.title ILIKE :keyword OR contents.description ILIKE :keyword ', { keyword: '%' + filters.keyword + '%' });
    }
    if (filters.where) {
      for (const prop in filters.where) {
        if (prop === 'deleted_at') {
          query = await query.andWhere('contents.' + prop + ' ' + (filters.where[prop] ? ' IS NOT NULL ' : ' IS NULL '));
        } else if (filters.where[prop] === true || filters.where[prop] === false) {
          query = await query.andWhere('contents.' + prop + ' ' + (filters.where[prop] ? '= true ' : '= false '));
        } else {
          query = await query.andWhere('contents.' + prop + ' = :dfilter ', { dfilter: filters.where[prop] });
        }
      }
    }

    query = query.limit(perPage)
          .offset((page - 1) * perPage);
    const totalPage = await query.getCount();

    return query.getMany()
          .then(async response => {
            if (!response) {
              return Promise.resolve(null);
            }

            const lastPage = await Math.ceil(totalPage / perPage);
            const result = {
              total: totalPage,
              per_page: Number(perPage),
              current_page: Number(page),
              last_page: totalPage > 0 ? lastPage : 1,
              data: response,
            };
            return Promise.resolve(result);
          }).catch(error => Promise.reject(error));
  }
  /**
   * Find a content
   *
   * @function
   */
  findOne(where: object = {}): Promise<Content> {
    where = {
      ...where,
      deleted_at: null,
    };
    return this.contentRepository.findOne({where, relations: ['content_attachments']});
  }
  /**
   * Find a content
   *
   * @function
   */
  findOneWithTrash(where: object = {}): Promise<Content> {
    return this.contentRepository.findOne({where, relations: ['content_attachments']});
  }

  /**
   * Create a content
   *
   * @function
   */
  create(content: Content): Promise<Content> {
    return this.contentRepository
      .findOne({ id: content.id })
      // .exec()
      .then(async dbContent => {
        // We check if a content already exists.
        // If it does don't create a new one.
        if (dbContent) {
          return Promise.reject({message: 'Content is already exist ' + dbContent.deleted_at ? '' : 'in the trash'});
        }
        return Promise.resolve(
          await this.contentRepository.save(content),
        );
      })
      .catch(error => Promise.reject(error));
  }
  /**
   * Seed all contents.
   *
   * @function
   */
  createMultiple(contents: Content[]): Array<Promise<Content>> {
    return contents.map(async (content: IContent) => {
      return await this.contentRepository
        .findOne({ id: content.id })
        // .exec()
        .then(async dbContent => {
          // We check if a content already exists.
          // If it does don't create a new one.
          if (dbContent) {
            return Promise.reject({message: 'Content is already exist ' + dbContent.deleted_at ? '' : 'in the trash'});
          }
          return Promise.resolve(
            await this.contentRepository.save(content),
          );
        })
        .catch(error => Promise.reject(error));
    });
  }

  /**
   * Update a content
   *
   * @function
   */
  async update(id: string, newData: any): Promise<Content> {
    const oldData = await this.contentRepository.findOne({ id});
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'Content is not exist'});
    }

    const updated: Content = Object.assign(oldData, newData);
    return this.contentRepository.save(updated)
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }

  /**
   * Delete a content
   *
   * @function
   */
  async delete(id: string): Promise<Content | DeleteResult> {
    const oldData = await this.contentRepository.findOne({ id});
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'Content is not exist'});
    }
    if (oldData.deleted_at) {
      return Promise.reject({statusCode: 404, message: 'Content is already in the trash'});
    }

    const updated: Content = Object.assign(oldData, {deleted_at: new Date(Date.now())});
    return this.contentRepository.save(updated)
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }

  /**
   * Delete a content
   *
   * @function
   */
  async restore(id: string): Promise<Content | DeleteResult> {
    const oldData = await this.contentRepository.findOne({ id });
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'Content is not exist'});
    }
    if (!oldData.deleted_at) {
      return Promise.reject({statusCode: 404, message: 'Content cannot be found in the trash'});
    }

    const updated: Content = Object.assign(oldData, {deleted_at: null});
    return this.contentRepository.save(updated)
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }

  /**
   * Delete a content
   *
   * @function
   */
  async forceDelete(id: string): Promise<Content | DeleteResult> {
    const oldData = await this.contentRepository.findOne({ id });
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'Content is not exist'});
    }
    if (!oldData.deleted_at) {
      return Promise.reject({statusCode: 404, message: 'Content cannot be found in the trash'});
    }

    return this.contentRepository.delete({id})
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }
}
