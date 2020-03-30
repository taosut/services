import { Controller, Get, Post, Body, Param, NotFoundException, BadRequestException, UnprocessableEntityException,
  Query, Put, Delete, HttpException, UseInterceptors, UploadedFiles, UploadedFile, Res, Logger } from '@nestjs/common';
import { ContentAttachmentService } from '../../providers/contentattachment/contentattachment.service';
import { ContentAttachment } from '../../models/contentattachment/contentattachment.entity';
import { CreateContentAttachmentDto, UpdateContentAttachmentDto } from '../../models/contentattachment/contentattachment.dto';
import { ApiImplicitParam, ApiImplicitQuery, ApiUseTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { convertResponse, convertDate } from '../_plugins/converter';
import { AwsService } from '../../_handler/aws/aws.service';

// tslint:disable-next-line: no-const-requires
// tslint:disable-next-line: no-var-requires
const mime = require('mime');

@ApiUseTags('Content Attachment')
@Controller('contentattachment')
export class ContentAttachmentController {
  private readonly awsService: AwsService;
  constructor(private readonly contentattachmentService: ContentAttachmentService) {
    this.awsService = new AwsService();
  }

  @Get(':id')
  @ApiImplicitParam({ name: 'id', description: 'Slug can replace with id. Example : the-title or 049ddb16-9f0f-41a2-90e6-39b8768c8184' })
  async findOne(@Param('id') id): Promise<object> {
    try {
      let contentattachment;

      contentattachment = await this.contentattachmentService.findOne({id});

      if (!contentattachment) {
        throw new NotFoundException('Not Found');
      }

      contentattachment = convertDate(contentattachment);
      return convertResponse(contentattachment);
    } catch (error) {
      Logger.error(JSON.stringify(error));
      if (error.statusCode) {
        throw new HttpException(error.message, error.statusCode);
      } else {
        throw new BadRequestException(error.message);
      }
    }
  }

  @Get(':id/download')
  @ApiImplicitParam({ name: 'id', description: 'Slug can replace with id. Example : the-title or 049ddb16-9f0f-41a2-90e6-39b8768c8184' })
  async findOneAndDownload(@Param('id') id, @Res() res) {
    try {
      let contentattachment;

      contentattachment = await this.contentattachmentService.findOne({id});

      if (!contentattachment) {
        throw new NotFoundException('Not Found');
      }
      const result = await this.awsService.fetchOne('contentattachment', contentattachment.path);

      const file = result;

      const filename = contentattachment.name;
      const mimetype = mime.lookup(file) ? mime.lookup(file) : contentattachment.type;

      res.setHeader('Content-disposition', 'attachment; filename=' + filename);
      res.setHeader('Content-type', mimetype);

      res.download(file, filename);
    } catch (error) {
      Logger.error(JSON.stringify(error));
      if (error.statusCode) {
        throw new HttpException(error.message, error.statusCode);
      } else {
        throw new BadRequestException(error.message);
      }
    }
  }

  @Delete(':id')
  @ApiImplicitParam({ name: 'id' })
  async delete(@Param('id') id: string): Promise<object> {
    try {
      let contentattachment;

      contentattachment = await this.contentattachmentService.findOne({id});

      if (!contentattachment) {
        throw new NotFoundException('Not Found');
      }

      const deleted = this.awsService.delete('contentattachment', contentattachment.path);

      let result;
      if (deleted) {
        result = await this.contentattachmentService.forceDelete(id);
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

  // @Post('attachment/file')
  // @ApiImplicitParam({ name: 'file', type: 'file' })
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadFile(@UploadedFile() file) {
  //   try {
  //     console.log(file);
  //     let result = await this.awsService.upload('contentattachment', file);

  //     result = convertDate(result);
  //     return convertResponse(result);
  //   } catch(error) {
  //     if (error.statusCode) throw new HttpException(error.message, error.statusCode);
  //     else throw new BadRequestException(error.message);
  //   }
  // }

  // @Get('attachment/files')
  // async fetchList(): Promise<object> {
  //   try {
  //     let result = await this.awsService.fetchList('contentattachment');
  //     console.log("result", result);

  //     result = convertDate(result);
  //     return convertResponse(result);
  //   } catch(error) {
  //     if (error.statusCode) throw new HttpException(error.message, error.statusCode);
  //     else throw new BadRequestException(error.message);
  //   }
  // }

  // @Get('attachment/files/:id')
  // @ApiImplicitParam({ name: 'id' })
  // async fetchOne(@Param('id') id, @Res() res) {
  //   try {
  //     let result = await this.awsService.fetchOne('contentattachment', id);

  //     var file = result;

  //     var filename = path.basename(file);
  //     var mimetype = mime.lookup(file);

  //     res.setHeader('Content-disposition', 'attachment; filename=' + filename);
  //     res.setHeader('Content-type', mimetype);

  //     res.download(file, filename);
  //   } catch(error) {
  //     if (error.statusCode) throw new HttpException(error.message, error.statusCode);
  //     else throw new BadRequestException(error.message);
  //   }
  // }
}
