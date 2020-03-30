import { Injectable } from '@nestjs/common';
import { LearningMembershipInvokeService } from '../../../invoke-services/learningMembership.service';
import dotenv = require('dotenv');
const { parsed } = dotenv.config({
  path: process.cwd() + '/.env'
});

process.env = { ...parsed, ...process.env };

@Injectable()
export class LearningMembershipService {
  constructor(
    private readonly learningMembershipInvokeService: LearningMembershipInvokeService
  ) {}
  async getMemberByLearningId(learningId: string): Promise<any> {
    try {
      const query = {
        filter: 'learning_id||eq||' + learningId
      };
      return await this.learningMembershipInvokeService.find(query);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getMembershipByUserId(userId: string): Promise<any> {
    try {
      try {
        const query = {
          filter: 'user_id||eq||' + userId
        };
        return await this.learningMembershipInvokeService.find(query);
      } catch (error) {
        return Promise.reject(error);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async addRemoveMembershipLearning(
    learningId: string,
    body: any
  ): Promise<any> {
    try {
      if (body.hasOwnProperty('remove_ids')) {
        for (const userId of body.remove_ids) {
          const queryMembership = {
            filter: `user_id||eq||${userId}`
          };
          let resMemberships = await this.learningMembershipInvokeService.find(
            queryMembership
          );
          if (resMemberships.length > 0) {
            resMemberships = await resMemberships.filter(
              item => item.learning_id === learningId
            );
            for (const membership of resMemberships) {
              this.learningMembershipInvokeService.delete(membership.id);
            }
          }
        }
      }

      const query = {
        filter: `learning_id||eq||${learningId}`
      };
      const memberships = await this.learningMembershipInvokeService.find(
        query
      );
      let ids = [];
      if (memberships.length > 0) {
        ids = await memberships.map(item => item.user_id);
      }

      if (body.hasOwnProperty('add_ids')) {
        for (const userId of body.add_ids) {
          const isExist = await ids.find(item => item === userId);
          if (!isExist) {
            await this.learningMembershipInvokeService.create({
              user_id: userId,
              learning_id: learningId,
              has_joined: false
            });
          }
        }
      }
      return body;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async changeJoinStatus(
    learningId: string,
    userId: string,
    hasJoined: boolean
  ): Promise<any> {
    try {
      const query = {
        fields: 'id',
        filter: `user_id||eq||${userId}`
      };

      let memberships = await this.learningMembershipInvokeService.find(query);
      memberships = memberships.filter(item => item.learning_id === learningId);
      if (memberships.length === 0) {
        return Promise.reject({
          statusCode: 404,
          message: 'Membership is not Found'
        });
      }
      const membershipId = memberships[0].id;

      return await this.learningMembershipInvokeService.update(membershipId, {
        user_id: userId,
        learning_id: learningId,
        has_joined: hasJoined
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
