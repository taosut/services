import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { QueryCertificateDto } from './certificate.dto';
import { Certificate } from './certificate.entity';
import { CertificateService } from './certificate.service';

@ApiUseTags('Certificates')
@Controller('certificates')
export class CertificateController {
  constructor(public service: CertificateService) {}

  @ApiOperation({
    title: 'Create a certificate',
  })
  @Post()
  async create(@Body() dto: Partial<Certificate>): Promise<Certificate> {
    try {
      return await this.service.createCertificate(dto);
    } catch (err) {
      throw new HttpException(
        err.message || err,
        err.statusCode || err.status || 500
      );
    }
  }

  @ApiOperation({
    title: 'Get a certificate by id',
  })
  @Get(':id')
  async findOneByClassId(@Param('id') id: string): Promise<Certificate> {
    try {
      return await this.service.findOne(id);
    } catch (err) {
      throw new HttpException(
        err.message || err,
        err.statusCode || err.status || 500
      );
    }
  }

  @ApiOperation({
    title: 'Get many certificates',
  })
  @Get()
  async findAll(
    @Query() query: QueryCertificateDto,
    @Headers('authorization') authorization: string,
    @Headers('realm') realm: string
  ): Promise<Certificate> {
    try {
      return await this.service.findByQuery(query, { realm, authorization });
    } catch (err) {
      throw new HttpException(
        err.message || err,
        err.statusCode || err.status || 500
      );
    }
  }
}
