import {
  // CacheInterceptor,
  Body,
  Controller,
  Delete,
  Headers,
  HttpException,
  Param,
  Post,
  // UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { Crud, CrudController, Override, ParsedBody } from '@nestjsx/crud';
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
// @UseInterceptors(CacheInterceptor)
export class ClassMembershipController
  implements CrudController<ClassMembership> {
  constructor(public service: ClassMembershipService) {}

  get base(): CrudController<ClassMembership> {
    return this;
  }

  @Post('membership-only')
  async createOneOnly(
    @Headers('realm') realm: string,
    @Headers('authorization') authorization: string,
    @Body() dto: ClassMembership
  ): Promise<any> {
    try {
      return await this.service.createOneBaseAndGenerateCompletion(
        { authorization, realm },
        dto, false
      );
    } catch (err) {
      throw new HttpException(
        err.message ? err : JSON.stringify(err),
        err.statusCode || err.status || 500
      );
    }
  }

  @Override()
  async createOne(
    @Headers('realm') realm: string,
    @Headers('authorization') authorization: string,
    @ParsedBody() dto: ClassMembership
  ): Promise<any> {
    try {
      return await this.service.createOneBaseAndGenerateCompletion(
        { authorization, realm },
        dto, true
      );
    } catch (err) {
      throw new HttpException(
        err.message ? err : JSON.stringify(err),
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
        err.message ? err : JSON.stringify(err),
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
        err.message ? err : JSON.stringify(err),
        err.statusCode || err.status || 500
      );
    }
  }
}
