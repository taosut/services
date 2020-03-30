import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompletionInvokeService } from '../services/completion.service';
import { FileService } from '../services/file.service';
import RedisService from '../services/redis.service';
import { CertificateController } from './certificate.controller';
import { Certificate } from './certificate.entity';
import { CertificateService } from './certificate.service';
import { LearnerCertificateController } from './learnerCertificate.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Certificate])],
  providers: [CertificateService, FileService, CompletionInvokeService, RedisService],
  controllers: [CertificateController, LearnerCertificateController],
  exports: [CertificateService],
})
export class CertificateModule {}
