import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Playlist } from '../../models/playlist/playlist.entity';
import { Repository, DeleteResult, Between } from 'typeorm';
import { IPlaylist } from '../../models/playlist/playlist.interface';
/**
 * Service dealing with playlist based operations.
 *
 * @class
 */
@Injectable()
export class PlaylistService {
  /**
   * Create an instance of class.
   *
   * @constructs
   *
   * @param {Repository<Playlist>} playlistRepository
   */
  constructor(
    @InjectRepository(Playlist)
    private readonly playlistRepository: Repository<Playlist>,
  ) {}
  /**
   * Find all playlist
   *
   * @function
   */
  async findAll(filters: any = {}): Promise<Playlist[]> {
    let query = await this.playlistRepository.createQueryBuilder('playlists');
    if (filters.keyword) {
      query = await query.where('playlists.title ILIKE :keyword OR playlists.description ILIKE :keyword ', { keyword: '%' + filters.keyword + '%' });
    }
    if (filters.where) {
      for (const prop in filters.where) {
        if (prop === 'deleted_at') {
          query = await query.andWhere('playlists.' + prop + ' ' + (filters.where[prop] ? ' IS NOT NULL ' : ' IS NULL '));
        } else if (filters.where[prop] === true || filters.where[prop] === false) {
          query = await query.andWhere('playlists.' + prop + ' ' + (filters.where[prop] ? '= true ' : '= false '));
        } else {
          query = await query.andWhere('playlists.' + prop + ' = :dfilter ', { dfilter: filters.where[prop] });
        }
      }
    }
    if (filters.like) {
      for (const prop in filters.like) {
        if (prop) {
          query = await query.andWhere('playlists.' + prop + ' LIKE :dLike ', { dLike: filters.like[prop] + '%' });
        }
      }
    }
    if (filters.orderBy) {
      for (const orderBy of filters.orderBy) {
        query = await query.addOrderBy(orderBy.column, orderBy.order);
      }
    }
    return query.getMany();
  }
  /**
   * Find all playlist with pagination
   *
   * @function
   */
  async findAllWithPagination(filters: any = {}): Promise<Playlist[]> {
    let page = 1;
    let perPage = 5;
    if (filters.page) {
      page = filters.page;
    }
    if (filters.per_page) {
      perPage = filters.per_page;
    }
    let query = await this.playlistRepository
                  .createQueryBuilder('playlists');

    if (filters.keyword) {
      query = await query.where('playlists.title ILIKE :keyword OR playlists.description ILIKE :keyword ', { keyword: '%' + filters.keyword + '%' });
    }
    if (filters.where) {
      for (const prop in filters.where) {
        if (prop === 'deleted_at') {
          query = await query.andWhere('playlists.' + prop + ' ' + (filters.where[prop] ? ' IS NOT NULL ' : ' IS NULL '));
        } else if (filters.where[prop] === true || filters.where[prop] === false) {
          query = await query.andWhere('playlists.' + prop + ' ' + (filters.where[prop] ? '= true ' : '= false '));
        } else {
          query = await query.andWhere('playlists.' + prop + ' = :dfilter ', { dfilter: filters.where[prop] });
        }
      }
    }
    if (filters.like) {
      for (const prop in filters.like) {
        if (prop) {
          query = await query.andWhere('playlists.' + prop + ' LIKE :dLike ', { dLike: filters.like[prop] + '%' });
        }
      }
    }
    if (filters.orderBy) {
      for (const orderBy of filters.orderBy) {
        query = await query.addOrderBy(orderBy.column, orderBy.order);
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
   * Find all playlist
   *
   * @function
   */
  async findAllPlaylistWithLectureWhereParentWithContent(where: any = {}): Promise<Playlist[]> {
    let query = await this.playlistRepository.createQueryBuilder('playlists');
    query = await query.leftJoinAndSelect('playlists.lessons', 'lessons', 'playlists.id = lessons.playlist_id')
            .leftJoinAndSelect('lessons.content', 'contents', 'lessons.id = contents.lesson_id')
            .where('playlists.course_id = :course_id', { course_id: where.course_id })
            .andWhere('lessons.lesson_type = :lesson_type', { lesson_type: 'lecture'})
            .andWhere('contents.id IS NOT NULL');
    return query.getMany();
  }
  /**
   * Find all playlist
   *
   * @function
   */
  async findAllPlaylistWithQuizWhereParentWithQuestions(where: any = {}): Promise<Playlist[]> {
    let query = await this.playlistRepository.createQueryBuilder('playlists');
    query = await query.leftJoinAndSelect('playlists.lessons', 'lessons', 'playlists.id = lessons.playlist_id')
            .leftJoinAndSelect('lessons.questions', 'quiz_questions', 'lessons.id = quiz_questions.quiz_id')
            .where('playlists.course_id = :course_id', { course_id: where.course_id })
            .andWhere('lessons.lesson_type = :lesson_type', { lesson_type: 'quiz'})
            .andWhere('quiz_questions.id IS NOT NULL');
    return query.getMany();
  }
  /**
   * Find a playlist
   *
   * @function
   */
  findOne(where: object = {}): Promise<Playlist> {
    where = {
      ...where,
      deleted_at: null,
    };
    return this.playlistRepository.findOne({where, relations: ['course']});
  }
  /**
   * Find a playlist
   *
   * @function
   */
  findOneWithTrash(where: object = {}): Promise<Playlist> {
    return this.playlistRepository.findOne({where, relations: ['course']});
  }

  /**
   * Create a playlist
   *
   * @function
   */
  create(playlist: Playlist): Promise<Playlist> {
    return this.playlistRepository
      .findOne({ id: playlist.id })
      // .exec()
      .then(async dbPlaylist => {
        // We check if a playlist already exists.
        // If it does don't create a new one.
        if (dbPlaylist) {
          return Promise.reject({message: 'Playlist is already exist ' + dbPlaylist.deleted_at ? '' : 'in the trash'});
        }
        return Promise.resolve(
          await this.playlistRepository.save(playlist),
        );
      })
      .catch(error => Promise.reject(error));
  }
  /**
   * Seed all playlists.
   *
   * @function
   */
  createMultiple(playlists: Playlist[]): Array<Promise<Playlist>> {
    return playlists.map(async (playlist: IPlaylist) => {
      return await this.playlistRepository
        .findOne({ id: playlist.id })
        // .exec()
        .then(async dbPlaylist => {
          // We check if a playlist already exists.
          // If it does don't create a new one.
          if (dbPlaylist) {
            return Promise.reject({message: 'Playlist is already exist ' + dbPlaylist.deleted_at ? '' : 'in the trash'});
          }
          return Promise.resolve(
            await this.playlistRepository.save(playlist),
          );
        })
        .catch(error => Promise.reject(error));
    });
  }

  /**
   * Update a playlist
   *
   * @function
   */
  async update(id: string, newData: any): Promise<Playlist> {
    const oldData = await this.playlistRepository.findOne({id});
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'Playlist is not exist'});
    }

    const updated: Playlist = Object.assign(oldData, newData);
    return this.playlistRepository.save(updated)
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }

  /**
   * Delete a playlist
   *
   * @function
   */
  async delete(id: string): Promise<Playlist | DeleteResult> {
    const oldData = await this.playlistRepository.findOne({id});
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'Playlist is not exist'});
    }
    if (oldData.deleted_at) {
      return Promise.reject({statusCode: 404, message: 'Playlist is already in the trash'});
    }

    const updated: Playlist = Object.assign(oldData, {deleted_at: new Date(Date.now())});
    return this.playlistRepository.save(updated)
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }

  /**
   * Delete a playlist
   *
   * @function
   */
  async restore(id: string): Promise<Playlist | DeleteResult> {
    const oldData = await this.playlistRepository.findOne({id});
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'Playlist is not exist'});
    }
    if (!oldData.deleted_at) {
      return Promise.reject({statusCode: 404, message: 'Playlist cannot be found in the trash'});
    }

    const updated: Playlist = Object.assign(oldData, {deleted_at: null});
    return this.playlistRepository.save(updated)
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }

  /**
   * Delete a playlist
   *
   * @function
   */
  async forceDelete(id: string): Promise<Playlist | DeleteResult> {
    const oldData = await this.playlistRepository.findOne({id});
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'Playlist is not exist'});
    }
    if (!oldData.deleted_at) {
      return Promise.reject({statusCode: 404, message: 'Playlist cannot be found in the trash'});
    }

    return this.playlistRepository.delete({id})
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }

  async changeOrder(data: any): Promise<any> {
    const oldData = await this.playlistRepository.findOne({id : data.id});
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'Playlist is not exist'});
    }
    const newData = {
      ...oldData,
      sort_order : data.sort_order,
    };
    const updated: Playlist = Object.assign(oldData, newData);

    return this.playlistRepository.save(updated)
    .then(res => Promise.resolve(res))
    .catch(error => Promise.reject(error));
  }

  /**
   * Find Playlist between Order
   *
   * @function
   */
  async findBetween(from: any, to: any, id: string): Promise<any> {
    return this.playlistRepository.find({
      where: {
        sort_order: Between(from, to),
        course_id : id,
      },
      order: {
        sort_order: 'ASC',
      },
    })
    .then(res => Promise.resolve(res))
    .catch(error => Promise.reject(error));
  }

  /**
   * Replace Track between Order
   *
   * @function
   */
  async replaceOrderBetween(id: string, operation: string, from: number, to: number): Promise<any> {
    const varbebas = '"sort_order" ' + (operation === 'minus' ? '-1' : '+1');
    return this.playlistRepository.createQueryBuilder().update(Playlist).set({
      sort_order : () => varbebas,
    }).where('sort_order BETWEEN :from AND :to', {
      from, to,
    }).andWhere('course_id = :id', {
      id,
    }).execute();
  }

  /**
   * Find Track between Order
   *
   * @function
   */
  async getOneOrder( id: string, order: string): Promise<any> {
    return this.playlistRepository.find({
      select : ['id', 'sort_order'],
      order : {
        sort_order : order === 'DESC' ? 'DESC' : 'ASC',
      },
      where: {
        track_id : id,
      },
      take : 1,
    })
    .then(res => Promise.resolve(res))
    .catch(error => Promise.reject(error));
  }
}
