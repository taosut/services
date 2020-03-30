import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import {
  Crud,
  CrudController,
  CrudRequest,
  GetManyDefaultResponse,
  Override,
  ParsedRequest,
} from '@nestjsx/crud';
import { AWSError, MediaConvert } from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';
import { Content } from './content.entity';
import { ContentService } from './content.service';
import { ContentDto, ContentResponse } from './types/content.dto';
import { IContentResponse, SignedUrlResponse } from './types/content.type';

@Crud({
  model: {
    type: Content,
  },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  routes: { exclude: ['createManyBase', 'replaceOneBase', 'createOneBase'] },
})
@ApiUseTags('Content')
@Controller('content')
export class ContentController {
  constructor(public readonly service: ContentService) {}

  get base(): CrudController<Content> {
    return this;
  }

  @Override()
  async getOne(@ParsedRequest() req: CrudRequest): Promise<ContentResponse> {
    try {
      const response = (await this.base.getOneBase(req)) as ContentResponse;

      if (response.path) {
        response.url = await this.service.getFileUrl(response);

        return response;
      }

      return response;
    } catch (error) {
      throw new HttpException(error.message, error.statusCode);
    }
  }

  @Override()
  async getMany(
    @ParsedRequest() req: CrudRequest
  ): Promise<GetManyDefaultResponse<ContentResponse> | ContentResponse[]> {
    try {
      const contentEntity = await this.base.getManyBase(req);

      const response = contentEntity as GetManyDefaultResponse<ContentResponse>;

      const contents: ContentResponse[] = contentEntity as ContentResponse[];

      if (contents.length) {
        for (const [index] of contents.entries()) {
          contents[index].url = await this.service.getFileUrl(contents[index]);
        }
      }

      if (response.data) {
        for (const [index] of response.data.entries()) {
          response.data[index].url = await this.service.getFileUrl(
            response.data[index]
          );
        }

        return response;
      }

      return contents;
    } catch (error) {
      throw new HttpException(error.message, error.statusCode);
    }
  }

  @ApiOperation({
    title: 'Generate signedUrl',
  })
  @Get(':id/signed-url')
  async generateSignedUrl(@Param('id') id: string): Promise<SignedUrlResponse> {
    return await this.service.generatePreSignedUrl(id);
  }

  @ApiOperation({
    title: 'create job to generate file',
  })
  @Get(':id/emc')
  async createEmcJob(
    @Param('id') id: string
  ): Promise<PromiseResult<MediaConvert.CreateJobResponse, AWSError>> {
    return await this.service.createEmcJob(id);
  }

  @ApiOperation({
    title: 'Create one Content',
  })
  @Post()
  async create(@Body() dto: ContentDto): Promise<IContentResponse> {
    const response = await this.service.create(dto);

    return response;
  }
}
