import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Track } from '../../../models/track/track.entity';
import { Repository } from 'typeorm';
import { ITrack } from '../../../models/track/track.interface';
import { data } from './data';
/**
 * Service dealing with track based operations.
 *
 * @class
 */
@Injectable()
export class TrackSeederService {
  /**
   * Create an instance of class.
   *
   * @constructs
   *
   * @param {Repository<Track>} trackRepository
   */
  constructor(
    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,
  ) {}
  /**
   * Seed all tracks.
   *
   * @function
   */
  create(): Array<Promise<Track>> {
    return data.map(async (track: ITrack) => {
      return await this.trackRepository
        .findOne({ id: track.id })
        // .exec()
        .then(async dbTrack => {
          // We check if a track already exists.
          // If it does don't create a new one.
          if (dbTrack) {
            return Promise.resolve(null);
          }
          return Promise.resolve(
            await this.trackRepository.save(track),
          );
        })
        .catch(error => Promise.reject(error));
    });
  }
}
