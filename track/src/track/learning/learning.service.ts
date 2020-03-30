import { Injectable, HttpException } from '@nestjs/common';
import dotenv = require('dotenv');
import _ = require('lodash');
import { LearningInvokeService } from '../../invoke-services/learning.service';
import { LearningMembershipInvokeService } from '../../invoke-services/learningMembership.service';
import { TrackService } from '../track.service';

const { parsed } = dotenv.config({
  path: process.cwd() + '/.env'
});

process.env = { ...parsed, ...process.env };

@Injectable()
export class LearningService {
  constructor(
    protected readonly trackService: TrackService,
    protected readonly learningInvokeService: LearningInvokeService,
    protected readonly learningMembershipInvokeService: LearningMembershipInvokeService
  ) {}

  async find(query) {
    try {
      return await this.learningInvokeService.find(query);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findLearningByLearner(userId, query) {
    try {
      if (query.track_id) {
        const isExist = await this.trackService.findOne({ id: query.track_id });
        if (!isExist) {
          throw new HttpException('Track is not found', 404);
        }
      }
      const queryMembership = {
        filter: 'user_id||eq||' + userId
      };
      if (query.hasOwnProperty('has_joined')) {
        if (query.has_joined === 'true' || query.has_joined === true) {
          query = {
            ...query,
            has_joined: true
          };
        } else if (query.has_joined === 'false' || query.has_joined === false) {
          query = {
            ...query,
            has_joined: false
          };
        }
        // queryMembership.filter.push('has_joined||eq||' + query.has_joined);
      }
      let memberships = await this.learningMembershipInvokeService.find(
        queryMembership
      );
      console.info('memberships', memberships);
      if (query.hasOwnProperty('has_joined')) {
        for (const data of memberships) {
          // console.info(
          //   'type data : ' +
          //     typeof data.has_joined +
          //     ', type query: ' +
          //     typeof query.has_joined
          // );
          // console.info(', eq? ' + data.has_joined === query.has_joined);
        }
        memberships = await memberships.filter(
          item => item.has_joined === query.has_joined
        );
      }
      if (memberships.length > 0) {
        memberships = await memberships.map(item => item.learning_id);
      } else {
        return [];
      }
      const queryLearning = {
        filter: 'id||in||' + memberships.join(',')
      };
      const learningsByIds = await this.learningInvokeService.find(
        queryLearning
      );
      let result = learningsByIds;
      if (query.track_id) {
        result = await learningsByIds.filter(
          item => item.trackId === query.track_id
        );
      }
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
