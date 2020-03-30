import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
  // Res,
} from '@nestjs/common';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import {
  Crud,
  CrudController,
  CrudRequest,
  GetManyDefaultResponse,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import { Content } from './content.entity';
import { ContentService } from './content.service';
import { FileService } from './file.service';
import { EContentType } from './interfaces/content.const';
import { ContentDto } from './interfaces/content.dto';

import {
  IContentResponse,
  ISignedUrlResponse,
} from './interfaces/content.interface';

@Crud({
  model: {
    type: Content,
  },
  query: {
    join: {
      subCategories: {},
    },
  },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
})
@ApiUseTags('content')
@Controller('content')
export class ContentController {
  constructor(
    public readonly service: ContentService,
    private readonly fileService: FileService
  ) {}

  get base(): CrudController<Content> {
    return this;
  }

  @Get('open')
  async open(@Query('path') filePath: string): Promise<string> {
    try {
      return this.fileService.getFileUrl(filePath);
    } catch (error) {
      throw new HttpException(error.message, error.statusCode);
    }
  }

  @Override()
  async getOne(@ParsedRequest() req: CrudRequest): Promise<object> {
    try {
      const response = await this.base.getOneBase(req);

      if (response.path) {
        const url = await this.fileService.getFileUrl(response.path);

        return { ...response, url };
      }

      return response;
    } catch (error) {
      throw new HttpException(error.message, error.statusCode);
    }
  }

  @Override()
  async getMany(
    @ParsedRequest() req: CrudRequest
  ): Promise<GetManyDefaultResponse<Content> | Content[]> {
    try {
      const response = await this.base.getManyBase(req);

      return response;
    } catch (error) {
      throw new HttpException(error.message, error.statusCode);
    }
  }

  @Override()
  async createOne(
    @ParsedRequest() req: CrudRequest,

    @ParsedBody() dto: ContentDto
  ): Promise<IContentResponse> {
    const correctType =
      dto.fileType === EContentType.video ||
      dto.fileType === EContentType.audio ||
      dto.fileType === EContentType.image ||
      dto.fileType === EContentType.pdf ||
      dto.fileType === EContentType.doc ||
      dto.fileType === EContentType.docx;

    if (!correctType) {
      throw new HttpException(
        {
          message: `Incorrect fileType, available fileType : [ ${EContentType.video}, ${EContentType.audio}, ${EContentType.image} ]`,
          status: HttpStatus.BAD_GATEWAY,
        },
        HttpStatus.BAD_GATEWAY
      );
    }

    const contentEntity = await this.base.createOneBase(req, dto as Content);

    const signedUrlResponse: ISignedUrlResponse = await this.fileService.getSignedUrl(
      dto.fileType,
      contentEntity.path
    );

    const response: IContentResponse = {
      ...contentEntity,
      generatedSignUrl: signedUrlResponse,
    };
    return response;
  }
  @Override()
  async updateOne(
    @ParsedRequest() req: CrudRequest,

    @ParsedBody() dto: ContentDto
  ): Promise<IContentResponse> {
    const correctType =
      dto.fileType === EContentType.video ||
      dto.fileType === EContentType.audio ||
      dto.fileType === EContentType.image;

    if (!correctType) {
      throw new HttpException(
        {
          message: `Incorrect fileType, available fileType : [ ${EContentType.video}, ${EContentType.audio}, ${EContentType.image} ]`,
          status: HttpStatus.BAD_GATEWAY,
        },
        HttpStatus.BAD_GATEWAY
      );
    }
    const contentEntity = await this.base.updateOneBase(req, dto as Content);

    const signedUrlResponse: ISignedUrlResponse = await this.fileService.getSignedUrl(
      dto.fileType,
      contentEntity.path
    );

    const response: IContentResponse = {
      ...contentEntity,
      generatedSignUrl: signedUrlResponse,
    };
    return response;
  }

  @ApiOperation({
    title: 'Generate signedUrl',
  })
  @Get(':id/signed-url')
  async generateSignedUrl(@Param('id') id: string): Promise<object> {
    const contentEntity = await this.service.findOne(id);
    const correctType =
      contentEntity.fileType === EContentType.video ||
      contentEntity.fileType === EContentType.audio ||
      contentEntity.fileType === EContentType.image;

    if (!correctType) {
      throw new HttpException(
        {
          message: `Incorrect type, available type : [ ${EContentType.video}, ${EContentType.audio}, ${EContentType.image} ]`,
          status: HttpStatus.BAD_GATEWAY,
        },
        HttpStatus.BAD_GATEWAY
      );
    }

    const response = await this.fileService.getSignedUrl(
      contentEntity.fileType,
      contentEntity.path
    );

    return response;
  }
}
