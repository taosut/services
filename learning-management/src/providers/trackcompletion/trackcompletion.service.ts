import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TrackCompletion } from '../../models/trackcompletion/trackcompletion.entity';
import { Repository, DeleteResult, Not, IsNull } from 'typeorm';
import { ITrackCompletion } from '../../models/trackcompletion/trackcompletion.interface';
/**
 * Service dealing with trackcompletion based operations.
 *
 * @class
 */
@Injectable()
export class TrackCompletionService {
  /**
   * Create an instance of class.
   *
   * @constructs
   *
   * @param {Repository<TrackCompletion>} trackcompletionRepository
   */
  constructor(
    @InjectRepository(TrackCompletion)
    private readonly trackcompletionRepository: Repository<TrackCompletion>,
  ) {}
  /**
   * Find all trackcompletion
   *
   * @function
   */
  async findAll(filters: any = {}): Promise<TrackCompletion[]> {
    let query = await this.trackcompletionRepository.createQueryBuilder('track_completions');
    if (filters.keyword) {
      query = await query.where('track_completions.title ILIKE :keyword OR track_completions.description ILIKE :keyword ',
                                { keyword: '%' + filters.keyword + '%' });
    }
    if (filters.where) {
      for (const prop in filters.where) {
        if (prop === 'deleted_at') {
          query = await query.andWhere('track_completions.' + prop + ' ' + (filters.where[prop] ? ' IS NOT NULL ' : ' IS NULL '));
        } else if (filters.where[prop] === true || filters.where[prop] === false) {
          query = await query.andWhere('track_completions.' + prop + ' ' + (filters.where[prop] ? '= true ' : '= false '));
        } else {
          query = await query.andWhere('track_completions.' + prop + ' = :dfilter ', { dfilter: filters.where[prop] });
        }
      }
    }
    return query.getMany();
  }
  /**
   * Find all trackcompletion with pagination
   *
   * @function
   */
  async findAllWithPagination(filters: any = {}): Promise<TrackCompletion[]> {
    let page = 1;
    let perPage = 5;
    if (filters.page) {
      page = filters.page;
    }
    if (filters.per_page) {
      perPage = filters.per_page;
    }
    let query = await this.trackcompletionRepository
                  .createQueryBuilder('track_completions');

    if (filters.keyword) {
      query = await query.where('track_completions.title ILIKE :keyword OR track_completions.description ILIKE :keyword ',
                                { keyword: '%' + filters.keyword + '%' });
    }
    if (filters.where) {
      for (const prop in filters.where) {
        if (prop === 'deleted_at') {
          query = await query.andWhere('track_completions.' + prop + ' ' + (filters.where[prop] ? ' IS NOT NULL ' : ' IS NULL '));
        } else if (filters.where[prop] === true || filters.where[prop] === false) {
          query = await query.andWhere('track_completions.' + prop + ' ' + (filters.where[prop] ? '= true ' : '= false '));
        } else {
          query = await query.andWhere('track_completions.' + prop + ' = :dfilter ', { dfilter: filters.where[prop] });
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
   * Find a trackcompletion
   *
   * @function
   */
  async findOne(where: object = {}): Promise<TrackCompletion> {
    return await this.trackcompletionRepository.findOne({where});
  }
  /**
   * Find a trackcompletion
   *
   * @function
   */
  findOneWithTrash(where: object = {}): Promise<TrackCompletion> {
    return this.trackcompletionRepository.findOne({where});
  }

  /**
   * Create a trackcompletion
   *
   * @function
   */
  create(trackcompletion: TrackCompletion): Promise<TrackCompletion> {
    return this.trackcompletionRepository
      .findOne({ id: trackcompletion.id })
      // .exec()
      .then(async dbTrackCompletion => {
        // We check if a trackcompletion already exists.
        // If it does don't create a new one.
        if (dbTrackCompletion) {
          return Promise.reject({message: 'TrackCompletion is already exist.'});
        }
        return Promise.resolve(
          await this.trackcompletionRepository.save(trackcompletion),
        );
      })
      .catch(error => Promise.reject(error));
  }
  /**
   * Seed all trackcompletions.
   *
   * @function
   */
  createMultiple(trackcompletions: TrackCompletion[]): Array<Promise<TrackCompletion>> {
    return trackcompletions.map(async (trackcompletion: ITrackCompletion) => {
      return await this.trackcompletionRepository
        .findOne({ id: trackcompletion.id })
        // .exec()
        .then(async dbTrackCompletion => {
          // We check if a trackcompletion already exists.
          // If it does don't create a new one.
          if (dbTrackCompletion) {
            return Promise.reject({message: 'TrackCompletion is already exist.'});
          }
          return Promise.resolve(
            await this.trackcompletionRepository.save(trackcompletion),
          );
        })
        .catch(error => Promise.reject(error));
    });
  }

  /**
   * Update a trackcompletion
   *
   * @function
   */
  async update(id: string, newData: any): Promise<TrackCompletion> {
    const oldData = await this.trackcompletionRepository.findOne({id});
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'TrackCompletion is not exist'});
    }
    const updated: TrackCompletion = Object.assign(oldData, newData);
    return this.trackcompletionRepository.save(updated)
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }
  /**
   * Delete a trackcompletion
   *
   * @function
   */
  async forceDelete(id: string): Promise<TrackCompletion | DeleteResult> {
    const oldData = await this.trackcompletionRepository.findOne({id});
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'TrackCompletion is not exist'});
    }
    return this.trackcompletionRepository.delete({id})
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }
}
