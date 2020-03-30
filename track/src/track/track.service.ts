import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Track } from './track.entity';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { DeleteResult, UpdateResult, In } from 'typeorm';
import { LearningInvokeService } from '../invoke-services/learning.service';
import { LearningTrackDto } from './learningTrack.dto';
import { LearningMembershipInvokeService } from '../invoke-services/learningMembership.service';

@Injectable()
export class TrackService extends TypeOrmCrudService<Track> {
  constructor(@InjectRepository(Track) repo,
              protected readonly learningInvokeService: LearningInvokeService,
              protected readonly learningMembershipInvokeService: LearningMembershipInvokeService) {
    super(repo);
  }

  async softDelete(id: string): Promise<Track | DeleteResult> {
    const oldData = await this.repo.findOne({id});
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'Track is not exist'});
    }
    if (oldData.deleted_at) {
      return Promise.reject({statusCode: 404, message: 'Track is already in the trash'});
    }

    const updated: Track = Object.assign(oldData, {sort_order: null, deleted_at: new Date(Date.now())});
    return this.repo.save(updated)
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }

  async restore(id: string): Promise<Track | DeleteResult> {
    const oldData = await this.repo.findOne({ id });
    if (!oldData) {
      return Promise.reject({statusCode: 404, message: 'Track is not exist'});
    }
    if (!oldData.deleted_at) {
      return Promise.reject({statusCode: 404, message: 'Track cannot be found in the trash'});
    }

    const updated: Track = Object.assign(oldData, {deleted_at: null});
    return this.repo.save(updated)
          .then(res => Promise.resolve(res))
          .catch(error => Promise.reject(error));
  }

  async getLearningByTrackId(trackId: string) {
    const track = await this.repo.findOneOrFail({id: trackId});
    const query = {
      filter: 'trackId||eq||' + trackId,
    };
    return this.learningInvokeService.find(query)
            .then(res => Promise.resolve(res))
            .catch(error => Promise.reject(error));
  }

  async addRemoveLearningToTrack(trackId: string, learningIds: LearningTrackDto): Promise<string[]> {
    try {
      const track = await this.repo.findOneOrFail({id: trackId});

      const query = {
        filter: 'trackId||eq||' + trackId,
      };
      const learnings = await this.learningInvokeService.find(query);
      let orders: string[] = [];
      for (const val of learnings) {
        orders.push(val.id);
      }

      if (learningIds.hasOwnProperty('remove_ids')) {
        for (const learningId of learningIds.remove_ids) {
          await this.learningInvokeService.update(learningId, {trackId: null});
          orders = await orders.filter(item => item !== learningId);
        }
      }
      if (learningIds.hasOwnProperty('add_ids')) {
        for (const learningId of learningIds.add_ids) {
          await this.learningInvokeService.update(learningId, {trackId});
          const isExist = await orders.find(item => item === learningId);
          if (!isExist) { orders.push(learningId); }
        }
      }

      await this.repo.update(trackId, { indexLearnings: orders });
      return orders;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getLearnerTracks(userId) {
    try {
      const queryMembership = {
        filter: 'user_id||eq||' + userId,
      };
      let memberships = await this.learningMembershipInvokeService.find(queryMembership);
      console.info('memberships', memberships);
      if (memberships.length > 0) {
        memberships = await memberships.map(item => item.learning_id);
      } else {
        return [];
      }
      const query = {
        filter: 'id||in||' + memberships.join(','),
      };
      const learningsByIds = await this.learningInvokeService.find(query);
      console.info('learningsByIds', learningsByIds);
      const ids = learningsByIds.map(item => item.trackId);
      console.info('ids', ids);
      if (ids.length > 0) {
        return await this.repo.find({where: {id: In(ids)}});
      } else {
        return [];
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
