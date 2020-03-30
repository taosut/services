import {
  Controller,
  Get,
  Headers,
  HttpException,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { getUserId } from '../utils/auth';
import { Certificate } from './certificate.entity';
import { CertificateService } from './certificate.service';

@ApiUseTags('[Learner] Certificates')
@Controller('learner/certificates')
export class LearnerCertificateController {
  constructor(public service: CertificateService) {}

  @ApiOperation({
    title: 'Get all certificates owned by current logged in user',
  })
  @Get()
  async findAllMyCertificates(
    @Headers('authorization') authorization: string,
    @Headers('realm') realm: string
  ): Promise<Certificate> {
    try {
      const userId = getUserId(authorization);
      if (!userId) {
        throw new UnauthorizedException();
      }
      return await this.service.findByQuery(
        {
          user_id: userId,
        },
        { realm, authorization }
      );
    } catch (err) {
      throw new HttpException(
        err.message || err,
        err.statusCode || err.status || 500
      );
    }
  }

  @ApiOperation({
    title: 'Get current user certificate by class id',
  })
  @Get('/class/:classId')
  async findOneByClassId(
    @Param('classId') classId: string,
    @Headers('authorization') authorization: string,
    @Headers('realm') realm: string
  ): Promise<Certificate> {
    try {
      const userId = getUserId(authorization);
      if (!userId) {
        throw new UnauthorizedException();
      }
      return await this.service.findOneByQuery(
        {
          class_id: classId,
          user_id: userId,
        },
        { realm, authorization }
      );
    } catch (err) {
      throw new HttpException(
        err.message || err,
        err.statusCode || err.status || 500
      );
    }
  }
}
