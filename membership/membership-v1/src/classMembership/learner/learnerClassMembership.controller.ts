import {
  CacheInterceptor,
  Controller,
  Headers,
  HttpException,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { getUserId } from '../../utils/auth';
import { ClassMembership } from '../classMembership.entity';
import { ClassMembershipService } from '../classMembership.service';

@ApiUseTags('[Learner] ClassMembership')
@Controller('learner/memberships')
@UseInterceptors(CacheInterceptor)
export class LearnerClassMembershipController {
  constructor(public service: ClassMembershipService) {}

  @Post(':classId/join')
  async createOne(
    @Param('classId') classId: string,
    @Headers('realm') realm: string,
    @Headers('authorization') authorization: string
  ): Promise<any> {
    const userId = getUserId(authorization);
    if (!userId) {
      throw new HttpException('Unauthorized', 401);
    }
    try {
      const dto: Partial<ClassMembership> = {
        class_id: classId,
        user_id: userId,
        has_joined: false,
      };
      return await this.service.createOneBaseAndGenerateCompletion(
        { authorization, realm },
        dto, true
      );
    } catch (err) {
      throw new HttpException(
        err.message || JSON.stringify(err),
        err.statusCode || err.status || 500
      );
    }
  }

  @ApiOperation({
    title: 'Start class (update has_joined to true)',
  })
  @Post(':classId/start')
  async join(
    @Param('classId') classId: string,
    @Headers('authorization') authorization: string,
    @Headers('realm') realm: string
  ): Promise<any> {
    const userId = getUserId(authorization);
    if (!userId) {
      throw new HttpException('Unauthorized', 401);
    }
    try {
      return await this.service.joinMembership(classId, userId, {
        realm,
        authorization,
      });
    } catch (err) {
      throw new HttpException(
        err.message || JSON.stringify(err),
        err.statusCode || err.status || 500
      );
    }
  }
}
