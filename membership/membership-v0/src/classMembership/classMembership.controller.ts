import {
  Controller,
  Delete,
  Headers,
  HttpException,
  Param,
  Patch,
} from '@nestjs/common';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { getUserId } from '../utils/auth';
import { ClassMembership } from './classMembership.entity';
import { ClassMembershipService } from './classMembership.service';

@Crud({
  model: {
    type: ClassMembership,
  },
  params: {
    id: {
      field: 'id',
      type: 'string',
      primary: true,
    },
  },
})
@ApiUseTags('ClassMembership')
@Controller('memberships')
export class ClassMembershipController {
  constructor(public service: ClassMembershipService) {}

  @ApiOperation({
    title: 'Join membership by class',
  })
  @Patch(':classId/join')
  async join(
    @Param('classId') classId: string,
    @Headers('authorization') authorization: string
  ): Promise<any> {
    const userId = getUserId(authorization);
    if (!userId) {
      throw new HttpException('Unauthorized', 401);
    }
    try {
      return await this.service.joinMembership(classId, userId);
    } catch (err) {
      throw new HttpException(
        err.message || JSON.stringify(err),
        err.statusCode || err.status || 500
      );
    }
  }

  @ApiOperation({
    title: 'Delete membership based on userId',
  })
  @Delete(':userId/user')
  async deleteByUserId(@Param('userId') userId: string): Promise<any> {
    try {
      return await this.service.deleteByUserId(userId);
    } catch (err) {
      throw new HttpException(
        err.message || JSON.stringify(err),
        err.statusCode || err.status || 500
      );
    }
  }

  @ApiOperation({
    title: 'Delete membership based on classId',
  })
  @Delete(':classId/class')
  async deleteByClassId(@Param('classId') classId: string): Promise<any> {
    try {
      return await this.service.deleteByClassId(classId);
    } catch (err) {
      throw new HttpException(
        err.message || JSON.stringify(err),
        err.statusCode || err.status || 500
      );
    }
  }
}
