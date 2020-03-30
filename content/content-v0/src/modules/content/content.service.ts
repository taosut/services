import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRequest } from '@nestjsx/crud';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { AWSError, MediaConvert } from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';
import _ from 'lodash';
import slugify from 'slugify';
import { Repository } from 'typeorm';
import { emcCreateJob } from '../../services/emc/create-job';
import { Content } from './content.entity';
import { FileService } from './file.service';
import { ContentDto } from './types/content.dto';
import { EContentType } from './types/content.enum';
import {
  IContent,
  IContentResponse,
  SignedUrlResponse,
} from './types/content.type';

@Injectable()
export class ContentService extends TypeOrmCrudService<Content> {
  constructor(
    @InjectRepository(Content)
    protected readonly repository: Repository<Content>,
    private readonly fileService: FileService
  ) {
    super(repository);
  }

  async getFileUrl(contentEntity: Content): Promise<string> {
    // const contentEntity = await this.repository.findOne(id);
    // console.info(contentEntity);
    if (contentEntity) {
      return await this.fileService.getSignedUrlGetObject(contentEntity);
    }

    // return null;
  }

  async generatePreSignedUrl(id: string): Promise<SignedUrlResponse> {
    const contentEntity = await this.repository.findOne(id);

    return await this.fileService.getSignedUrlUploadObject(
      contentEntity.file_type,
      contentEntity.path
    );
  }

  async createEmcJob(
    id: string
  ): Promise<PromiseResult<MediaConvert.CreateJobResponse, AWSError>> {
    const contentEntity = await this.repository.findOne(id);

    const org = await this.getOrg();
    const bucket = this.fileService.getS3BucketName('agora');
    return await emcCreateJob(org, bucket, contentEntity);
  }

  async create(dto: ContentDto): Promise<IContentResponse> {
    this.validateType(dto);
    const entry = this.repository.create(dto);

    const contentEntity = await this.repository.save(entry);

    const filePath = await this.generateFilePath(contentEntity);

    const signedUrlResponse: SignedUrlResponse = await this.fileService.getSignedUrlUploadObject(
      dto.file_type,
      filePath
    );

    contentEntity.path = filePath;

    await this.repository.save(contentEntity);

    const response: IContentResponse = {
      ...contentEntity,
      generated_sign_url: signedUrlResponse,
    };

    return response;
  }

  async deleteOne(req: CrudRequest): Promise<void | Content> {
    if (req.parsed.paramsFilter && req.parsed.paramsFilter[0].field === 'id') {
      const content = await this.repository.findOneOrFail(
        req.parsed.paramsFilter[0].value
      );

      if (content.path) {
        await this.fileService.delete(content.path);
      }
    }

    await super.deleteOne(req);
  }

  async update(id: string, dto: IContent): Promise<Content> {
    const entity = await this.repository.create(dto);

    entity.id = id;

    const response = await this.repository.save(entity);

    return response;
  }

  async getOrg(): Promise<string> {
    return 'agora';

    // configs.authorization.sub
    //  invokde {{accounts service}}accounts/findByUsername?username=learner
  }

  async generateFilePath(dto: ContentDto): Promise<string> {
    const fileName = `${dto.id}-${slugify(dto.name.toString(), {
      replacement: '-',
      remove: /[^\w\-]/g,
      lower: true,
    })}`;

    const extension = `.${dto.file_type.split('/')[1]}`;

    const client = await this.getOrg();

    const type = dto.file_type.split('/');

    const dir = `${client}/${type[0]}/${dto.id}/`;

    const path = (dir + fileName + extension).toLowerCase();

    return path;
  }

  validateType(dto: ContentDto): void {
    const contentTypes = _.values(EContentType);

    if (!_.includes(contentTypes, dto.file_type)) {
      throw new HttpException(
        {
          message: `Incorrect fileType, available fileType : [ ${contentTypes.toString()} ]`,
          status: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
