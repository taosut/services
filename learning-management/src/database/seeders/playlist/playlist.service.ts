import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Playlist } from '../../../models/playlist/playlist.entity';
import { Repository } from 'typeorm';
import { IPlaylist } from '../../../models/playlist/playlist.interface';
import { data } from './data';
/**
 * Service dealing with playlist based operations.
 *
 * @class
 */
@Injectable()
export class PlaylistSeederService {
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
   * Seed all playlists.
   *
   * @function
   */
  create(): Array<Promise<Playlist>> {
    return data.map(async (playlist: IPlaylist) => {
      return await this.playlistRepository
        .findOne({ id: playlist.id })
        // .exec()
        .then(async dbPlaylist => {
          // We check if a playlist already exists.
          // If it does don't create a new one.
          if (dbPlaylist) {
            return Promise.resolve(null);
          }
          return Promise.resolve(
            await this.playlistRepository.save(playlist),
          );
        })
        .catch(error => Promise.reject(error));
    });
  }
}
