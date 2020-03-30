import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import uuid = require('uuid');
import { CompletionInvokeService } from '../services/completion.service';
import { FileService } from '../services/file.service';
import { Certificate } from './certificate.entity';
import { FileMeta } from './fileMeta';

@Injectable()
export class CertificateService extends TypeOrmCrudService<Certificate> {
  constructor(
    @InjectRepository(Certificate) repo: Repository<Certificate>,
    public fileService: FileService,
    private readonly completionInvokeService: CompletionInvokeService
  ) {
    super(repo);
  }

  async createCertificate(dto: Partial<Certificate>): Promise<Certificate> {
    try {
      const created = await this.repo.create(dto);
      return await this.repo.save(created);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async findByQuery(query: any, headers: any): Promise<any> {
    try {
      const queries: string[] = [];
      if (query.class_id) {
        const tmpQuery = `JSON_CONTAINS(class->'$.id', '"${query.class_id}"')`;
        queries.push(tmpQuery);
      }
      if (query.user_id) {
        const tmpQuery = `JSON_CONTAINS(user->'$.id', '"${query.user_id}"')`;
        queries.push(tmpQuery);
      }
      const whereString = queries.join(' AND ');
      const results = await this.repo
        .createQueryBuilder('certificates')
        .where(whereString)
        .orderBy('created_at', 'DESC')
        .getMany();
      if (results.length === 0) {
        const certificateData = await this.completionInvokeService.generateCertificateData(
          {
            user_id: query.user_id,
            class_id: query.class_id,
          },
          headers
        );
        if (certificateData) {
          const classCompletion: any = certificateData.completion;
          if (classCompletion && !classCompletion.finished) {
            throw new HttpException('Completion has not been completed', 400);
          }
          const tmpCertificate = await this.createCertificate(certificateData);
          results.push(tmpCertificate);
        }
      } else if (results.length > 1) {
        // sort desc
        results.sort((a, b) => {
          // DESC
          const dateB = new Date(b.created_at).getTime();
          const dateA = new Date(a.created_at).getTime();
          return dateB - dateA;
        });
        // end of sort
      }
      return results;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async findOneByQuery(query: any, headers: any): Promise<any> {
    try {
      const certificates = await this.findByQuery(query, headers);
      if (!certificates || (certificates && certificates.length === 0)) {
        return Promise.reject({
          statusCode: 404,
          message: 'Certificate is not found',
        });
      } else {
        return certificates[0];
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async upload(id: string, file: any): Promise<any> {
    try {
      let certificateData: any = await this.repo.findOne(id);
      if (!certificateData) {
        // throw error not found
        // throw new HttpException('Certificate is not found', 404);
        certificateData = {
          ...certificateData,
          id: 'certificateId',
          user: {
            username: 'username',
          },
        };
      }
      let type = null;
      if (file.mimetype === 'application/pdf') {
        type = 'pdf';
      } else if (file.mimetype.includes('image')) {
        const exp = file.originalname.split('.');
        if (exp && Array.isArray(exp) && exp.length > 0) {
          type = exp[exp.length - 1];
        }
      }
      const key =
        'certificates/' +
        certificateData.id +
        '-' +
        certificateData.user.username +
        '-' +
        uuid.v4() +
        '.' +
        type;
      const url = this.fileService.getFileUrl(key);
      await this.fileService.upload(key, file);
      // await this.repo.update(id, {
      //   url,
      // });
      return {
        ...certificateData,
        url,
      };
    } catch (err) {
      console.error(JSON.stringify(err));
      throw new HttpException(err, 400);
    }
  }

  async getSignedUrl(id: string, fileMeta: FileMeta): Promise<any> {
    try {
      const certificateData: any = await this.repo.findOne(id);
      if (!certificateData) {
        // throw error not found
        throw new HttpException('Certificate is not found', 404);
      }
      let type = 'application/pdf';
      if (fileMeta.type === 'application/pdf') {
        type = 'pdf';
      } else if (fileMeta.type.includes('image/')) {
        const exp = fileMeta.originalname.split('.');
        if (exp && Array.isArray(exp) && exp.length > 0) {
          type = exp[exp.length - 1];
        }
      }
      const key =
        'certificates/' +
        certificateData.id +
        '-' +
        certificateData.user.username +
        '-' +
        uuid.v4() +
        '.' +
        type;
      await this.repo.update(id, {
        url: key,
      });
      return this.fileService.getSignedUrlUploadObject(type, key);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
