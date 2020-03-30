import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlaylistCompletion } from '../../models/playlistcompletion/playlistcompletion.entity';
import { Repository, DeleteResult, Not, IsNull } from 'typeorm';
import { IPlaylistCompletion } from '../../models/playlistcompletion/playlistcompletion.interface';
/**
 * Service dealing with playlistcompletion based operations.
 *
 * @class
 */
@Injectable()
export class PlaylistCompletionService {
  /**
   * Create an instance of class.
   *
   * @constructs
   *
   * @param {Repository<PlaylistCompletion>} playlistcompletionRepository
   */
  constructor(
    @InjectRepository(PlaylistCompletion)
    private readonly playlistcompletionRepository: Repository<PlaylistCompletion>,
  ) {}
  /**
   * Find all playlistcompletion
   *
   * @function
   */
  async findAll(filters: any = {}): Promise<PlaylistCompletion[]> {
    let query = await this.playlistcompletionRepository.createQueryBuilder('playlist_completions');
    if (filters.keyword) {
      query = await query.where('playlist_completions.title ILIKE :keyword OR playlist_completions.description ILIKE :keyword ',
                                { keyword: '%' + filters.keyword + '%' });
    }
    if (filters.where) {
      for (const prop in filters.where) {
        if (prop === 'deleted_at') {
          query = await query.andWhere('playlist_completions.' + prop + ' ' + (filters.where[prop] ? ' IS NOT NULL ' : ' IS NULL '));
        } else if (filters.where[prop] === true || filters.where[prop] === false) {
          query = await query.andWhere('playlist_completions.' + prop + ' ' + (filters.where[prop] ? '= true ' : '= false '));
        } else {
          query = await query.andWhere('playlist_completions.' + prop + ' = :dfilter ', { dfilter: filters.where[prop] });
        }
      }
    }
    return query.getMany();
  }
  /**
   * Find all playlistcompletion with pagination
   *
   * @function
   */
  async findAllWithPagination(filters: any = {}): Promise<PlaylistCompletion[]> {
    let page = 1;
    let perPage = 5;
    if (filters.page) {
      page = filters.page;
    }
    if (filters.per_page) {
      perPage = filters.per_page;
    }
    let query = await this.playlistcompletionRepository
                  .createQueryBuilder('playlist_completions');

    if (filters.keyword) {
      query = await query.where('playlist_completions.title ILIKE :keyword OR playlist_completions.description ILIKE :keyword ',
                                { keyword: '%' + filters.keyword + '%' });
    }
    if (filters.where) {
      for (const prop in filters.where) {
        if (prop === 'deleted_at') {
          query = await query.andWhere('playlist_completions.' + prop + ' ' + (filters.where[prop] ? ' IS NOT NULL ' : ' IS NULL '));
        } else if (filters.where[prop] === true || filters.where[prop] === false) {
          query = await query.andWhere('playlist_completions.' + prop + ' ' + (filters.where[prop] ? '= true ' : '= false '));
        } else {
          query = await query.andWhere('playlist_completions.' + prop + ' = :dfilter ', { dfilter: filters.where[prop] });
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
   * Find a playlistcompletion
   *
   * @function
   */
  async findOne(where: object = {}): Promise<PlaylistCompletion> {
    return await this.playlistcompletionRepository.findOne({where});
  }
  /**
   * Find a playlistcompletion
   *
   * @function
   */
  findOneWithTrash(where: object = {}): Promise<PlaylistCompletion> {
    return this.playlistcompletionRepository.findOne({where});
  }

  /**
   * Create a playlistcompletion
   *
   * @function
   */
  create(playlistcompletion: PlaylistCompletion): Promise<PlaylistCompletion> {
    return this.playlistcompletionRepository
      .findOne({ id: playlistcompletion.id })
      // .exec()
      .then(async dbPlaylistCompletion => {
        // We check if a playlistcompletion already exists.
        // If it does don't create a new one.
        if (dbPlaylistCompletion) {
          return Promise.reject({message: 'PlaylistCompletion is already exist.'});
        }
        return Promise.resolve(
          await this.playlistcompletionRepository.save(playlistcompletion),
        );
      })
      .catch(error => Promise.reject(error));
  }
  /**
   * Seed all playlistcompletions.
   *
   * @function
   */
  createMultiple(playlistcompletions: PlaylistCompletion[]): Array<Promise<PlaylistCompletion>> {
    return playlistcompletions.map(async (playlistcompletion: IPlaylistCompletion) => {
      return await this.playlistcompletionRepository
        .findOne({ id: playlistcompletion.id })
        // .exec()
        .then(async dbPlaylistCompletion => {
          // We check if a playlistcompletion already exists.
          // If it does don't create a new one.
          if (dbPlaylistCompletion) {
            return Promise.reject({message: 'PlaylistCompletion is already exist.'});
          }
          return Promise.resolve(
            await this.playlistcompletionRepository.save(playlistcompletion),
          );
        })
        .catch(error => Promise.reject(error));
    });
  }

  /**
   * Update a playlistcompletion
   *
   * @function
   */
  async update(id: string, newData: any): Promise<PlaylistCompletion> {
    const oldData = await this.playlistcompletionRepository.findOne({id});
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'PlaylistCompletion is not exist'});
    }
    const updated: PlaylistCompletion = Object.assign(oldData, newData);
    return this.playlistcompletionRepository.save(updated)
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }
  /**
   * Delete a playlistcompletion
   *
   * @function
   */
  async forceDelete(id: string): Promise<PlaylistCompletion | DeleteResult> {
    const oldData = await this.playlistcompletionRepository.findOne({id});
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'PlaylistCompletion is not exist'});
    }
    return this.playlistcompletionRepository.delete({id})
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }
}
