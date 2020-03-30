import {
  Controller, Post, Body, Param, NotFoundException,
  BadRequestException, UnprocessableEntityException,
  Put, HttpException, UseInterceptors, UploadedFile,
  Logger } from '@nestjs/common';
import { ContentService } from '../../providers/content/content.service';
import { Content } from '../../models/content/content.entity';
import { CreateContentDto, UpdateContentDto } from '../../models/content/content.dto';
import { ApiImplicitParam, ApiUseTags, ApiConsumes, ApiImplicitFile } from '@nestjs/swagger';
import { convertResponse, convertDate } from '../_plugins/converter';
import { ContentAttachmentService } from '../../providers/contentattachment/contentattachment.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ContentAttachment } from '../../models/contentattachment/contentattachment.entity';
import { CreateContentAttachmentDto } from '../../models/contentattachment/contentattachment.dto';
import { AwsService } from '../../_handler/aws/aws.service';
import { LessonService } from '../../providers/lesson/lesson.service';
import * as validate from 'uuid-validate';
import uuid = require('uuid');

@ApiUseTags('Lesson')
@Controller('lesson')
export class ContentController {
  private readonly awsService: AwsService;
  constructor(private readonly contentService: ContentService,
              private readonly contentAttachmentService: ContentAttachmentService,
              private readonly lessonService: LessonService) {
    this.awsService = new AwsService();
  }

  @Put(':slug/content')
  @ApiImplicitParam({ name: 'slug', description: 'Example : c110f4d3-9f7f-4c70-990b-7a85aa77278e' })
  async create(@Param('slug') lessonSlug, @Body() createDto: CreateContentDto): Promise<object> {
    try {
      let lesson;
      if (validate(lessonSlug)) {
        lesson = await this.lessonService.findOne({id: lessonSlug});

        if (!lesson) {
          throw new NotFoundException('Lesson is not Found');
        }
      } else {
        lesson = await this.lessonService.findOne({slug: lessonSlug});

        if (lesson) {
          throw new NotFoundException('Lesson is not Found');
        }
      }

      const baseData = new Content();
      let createData: Content = Object.assign(baseData, createDto);

      const isContentForLessonExist = await this.contentService.findOne({lesson_id: lesson.id});

      let result;
      if (isContentForLessonExist) {
        // update
        const updateDto: UpdateContentDto = {
          content: createData.content,
          video_source: createData.video_source,
          video_link: createData.video_link,
          content_attachments: [],
        };
        result = await this.contentService.update(isContentForLessonExist.id, updateDto);

        result = convertDate(result);
        return convertResponse(result);
      } else {
        createData = {
          ...createData,
          lesson_id: lesson.id,
        };
        result = await this.contentService.create(createData);
      }

      // create content attachment
      if (result && createData.content_attachments) {
        if (!Array.isArray(createData.content_attachments)) {
          throw new UnprocessableEntityException('Attachments must be an array of object');
        }
        for (const item of createData.content_attachments) {
          const baseAttachmentData = new ContentAttachment();
          const data = {
            content_id: result.id,
            id: item.id,
            name: item.name,
            type: item.type,
            size: item.size,
            path: item.path,
          };
          const inputAttachmentData: ContentAttachment = Object.assign(baseAttachmentData, data);
          const createAttachment = await this.contentAttachmentService.create(inputAttachmentData);
          if (!createAttachment) {
            throw new BadRequestException('Cannot create attachment [' + item.name + ']');
          }
        }
      }

      result = convertDate(result);
      return convertResponse(result);
    } catch (error) {
      Logger.error(JSON.stringify(error));
      if (error.statusCode) {
        throw new HttpException(error.message, error.statusCode);
      } else {
        throw new BadRequestException(error.message);
      }
    }
  }

  // @Delete(':id')
  // @ApiImplicitParam({ name: 'id' })
  // async forceDelete(@Param('id') id: string): Promise<object> {
  //   try {
  //     let result = await this.contentService.forceDelete(id);

  //     result = convertDate(result);
  //     return convertResponse(result);
  //   } catch(error) {
  //     if (error.statusCode) {
  //       throw new HttpException(error.message, error.statusCode);
  //     } else {
  //       throw new BadRequestException(error.message);
  //     }
  //   }
  // }

  // add attachment to content
  @Post(':slug/attachment')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiImplicitParam({ name: 'slug', description: 'Example : c110f4d3-9f7f-4c70-990b-7a85aa77278e' })
  @ApiImplicitFile({ name: 'file' })
  async addAttachment(@Param('slug') lessonSlug, @UploadedFile() file: any): Promise<object> {
    try {
      let lesson;
      if (validate(lessonSlug)) {
        lesson = await this.lessonService.findOne({id: lessonSlug});

        if (!lesson) {
          throw new NotFoundException('Lesson is not Found');
        }
      } else {
        lesson = await this.lessonService.findOne({slug: lessonSlug});

        if (lesson) {
          throw new NotFoundException('Lesson is not Found');
        }
      }

      let content;
      content = await this.contentService.findOne({lesson_id: lesson.id});

      if (!content) {
        throw new NotFoundException('Content is not Found');
      }

      const baseData = new ContentAttachment();
      const createDto: CreateContentAttachmentDto = {
        id: uuid.v4(),
        content_id: content.id,
        name: file.originalname,
        type: file.mimetype,
        size: file.size,
        path: null,
      };

      console.log(file);
      let createData: ContentAttachment = Object.assign(baseData, createDto);

      // upload file to aws
      const uploaded: any = await this.awsService.upload('contentattachment', file);
      // console.log('Uploaded File', uploaded);

      createData = {
        ...createData,
        path: uploaded.fileName,
      };

      // console.log('Attachment', attachment);

      const result = await this.contentService.findOne({id: content.id});

      return result;
      // let createData: ContentAttachment = Object.assign(baseData, createDto);

      // let result = await this.contentattachmentService.create(createData);

      // result = convertDate(result);
      // return convertResponse(result);
    } catch (error) {
      Logger.error(JSON.stringify(error));
      if (error.statusCode) {
        throw new HttpException(error.message, error.statusCode);
      } else {
        throw new BadRequestException(error.message);
      }
    }
  }
}
