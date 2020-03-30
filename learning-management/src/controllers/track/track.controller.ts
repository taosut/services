import { Controller, Get, Post, Body, Param,
  NotFoundException, BadRequestException,
  Query, Put, Delete, HttpException, Patch, UseInterceptors, UploadedFile, Res, HttpStatus, Logger } from '@nestjs/common';
import { TrackService } from '../../providers/track/track.service';
import { Track } from '../../models/track/track.entity';
import { CreateTrackDto, UpdateTrackDto, AddTrackCourseDto, ChangeTrackOrder, UpdateTrackImageDto } from '../../models/track/track.dto';
import { ApiImplicitParam, ApiImplicitQuery, ApiUseTags, ApiConsumes, ApiImplicitFile } from '@nestjs/swagger';
import { convertResponse, convertDate, getAssetURL } from '../_plugins/converter';
import { IsNull, Not } from 'typeorm';
import { slugify } from '../_plugins/slugify';
import { CourseService } from '../../providers/course/course.service';
import * as validate from 'uuid-validate';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsService } from '../../_handler/aws/aws.service';
import uuid = require('uuid');
import { AuthService } from '../../_handler/auth/auth.service';

// tslint:disable-next-line: no-const-requires
// tslint:disable-next-line: no-var-requires
const mime = require('mime');

@ApiUseTags('Track')
@Controller('track')
export class TrackController {
  private readonly authService: AuthService;
  private readonly awsService: AwsService;
  constructor(private readonly trackService: TrackService, private readonly courseService: CourseService) {
    this.awsService = new AwsService();
    this.authService = new AuthService();
  }

  @Get()
  @ApiImplicitQuery({ name: 'page', required: false })
  @ApiImplicitQuery({ name: 'per_page', required: false, enum: ['5', '10', '50', '100', '500', '1000', 'no-paginate'] })
  @ApiImplicitQuery({ name: 'keyword', required: false })
  @ApiImplicitQuery({ name: 'filter', required: false, enum: ['all', 'published', 'unpublished', 'trash'] })
  @ApiImplicitQuery({ name: 'sort_order', required: false, enum: ['ASC', 'DESC'] })
  @ApiImplicitQuery({ name: 'order_by', required: false, enum: ['sort_order', 'title', 'created_at', 'updated_at'] })
  async findAll(@Query() query) {
    try {
      let perPage: number|string = 5;
      if (query.per_page) {
        perPage = query.per_page;
      } else {
        perPage = 5;
      }
      let orderBy;
      let sortOrder;
      if (query.order_by) {
        orderBy = query.order_by;
      } else {
        orderBy = 'sort_order';
      }
      if (query.sort_order === 'DESC' || query.sort_order === 'desc') {
        sortOrder = query.sort_order;
      } else {
        sortOrder = 'ASC';
      }

      query = {
        ...query,
        where: {
          deleted_at: null,
        },
        orderBy: [{
          column: orderBy,
          order: sortOrder,
        }],
      };
      let result = null;
      if (query.filter === 'published') {
        query = {
          ...query,
          where: {
            ...query.where,
            published: true,
          },
        };
      } else if (query.filter === 'unpublished') {
        query = {
          ...query,
          where: {
            ...query.where,
            published: false,
          },
        };
      } else if (query.filter === 'trash') {
        query = {
          ...query,
          where: {
            ...query.where,
            deleted_at: 'IS NOT NULL',
          },
        };
      }

      if (perPage === 'no-paginate') {
        result = await this.trackService.findAll(query);
        result = await result.map(item => {
          return {
            ...item,
            preview: getAssetURL('track', item.id, item.preview),
          };
        });

        const ids: string[] = [];
        for (const value of result) {
          ids.push(value.id);
        }

        const list = await this.trackService.getListByIds(ids);

        // calculate duration
        for (const keyTrack in list) {
          if (true) {
            let totalDurationFromAllCourseInTrack = 0;
            for (const keyCourse in list[keyTrack].courses) {
              if (true) {
                let totalDurationFromAllPlaylistInCourse = 0;
                for (const keyPlaylist in list[keyTrack].courses[keyCourse].playlists) {
                  if (true) {
                    totalDurationFromAllPlaylistInCourse += list[keyTrack].courses[keyCourse].playlists[keyPlaylist].duration;
                  }
                }
                totalDurationFromAllCourseInTrack += totalDurationFromAllPlaylistInCourse;
              }
            }

            for (const i in result) {
              if (result[i].id === list[keyTrack].id) {
                result[i] = {
                  ...result[i],
                  duration: totalDurationFromAllCourseInTrack,
                };
              }
            }
          }
        }
        // end calculate duration
      } else {
        query = {
          ...query,
          per_page: Number(perPage),
        };
        result = await this.trackService.findAllWithPagination(query);
        result.data = await result.data.map(item => {
          return {
            ...item,
            preview: getAssetURL('track', item.id, item.preview),
          };
        });

        // get list tracks by ids to calculate duration
        const ids: string[] = [];
        for (const value of result.data) {
          ids.push(value.id);
        }

        const list = await this.trackService.getListByIds(ids);

        // calculate duration
        for (const keyTrack in list) {
          if (true) {
            let totalDurationFromAllCourseInTrack = 0;
            for (const keyCourse in list[keyTrack].courses) {
              if (true) {
                let totalDurationFromAllPlaylistInCourse = 0;
                for (const keyPlaylist in list[keyTrack].courses[keyCourse].playlists) {
                  if (true) {
                    totalDurationFromAllPlaylistInCourse += list[keyTrack].courses[keyCourse].playlists[keyPlaylist].duration;
                  }
                }
                totalDurationFromAllCourseInTrack += totalDurationFromAllPlaylistInCourse;
              }
            }

            for (const i in result.data) {
              if (result.data[i].id === list[keyTrack].id) {
                result.data[i] = {
                  ...result.data[i],
                  duration: totalDurationFromAllCourseInTrack,
                };
              }
            }
          }
        }
        // end calculate duration
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

  @Get(':slug')
  @ApiImplicitParam({ name: 'slug', description: 'Slug can replace with id. Example : the-title or 049ddb16-9f0f-41a2-90e6-39b8768c8184' })
  async findOne(@Param('slug') slug): Promise<object> {
    try {
      let track;
      if (validate(slug)) {
        track = await this.trackService.findOne({id: slug});

        if (!track) {
          throw new NotFoundException('Not Found');
        }
      } else {
        track = await this.trackService.findOne({slug});

        if (!track) {
          throw new NotFoundException('Not Found');
        }
      }

      track = {
        ...track,
        preview: getAssetURL('track', track.id, track.preview),
      };

      // get list tracks by ids to calculate duration
      const ids: string[] = [track.id];

      const list = await this.trackService.getListByIds(ids);

      // calculate duration
      for (const keyTrack in list) {
        if (true) {
          let totalDurationFromAllCourseInTrack = 0;
          for (const keyCourse in list[keyTrack].courses) {
            if (true) {
              let totalDurationFromAllPlaylistInCourse = 0;
              for (const keyPlaylist in list[keyTrack].courses[keyCourse].playlists) {
                if (true) {
                  totalDurationFromAllPlaylistInCourse += list[keyTrack].courses[keyCourse].playlists[keyPlaylist].duration;
                }
              }
              totalDurationFromAllCourseInTrack += totalDurationFromAllPlaylistInCourse;
            }
          }

          track = {
            ...track,
            duration: totalDurationFromAllCourseInTrack,
          };
        }
      }
      // end calculate duration

      track = convertDate(track);
      return convertResponse(track);
    } catch (error) {
      Logger.error(JSON.stringify(error));
      if (error.statusCode) {
        throw new HttpException(error.message, error.statusCode);
      } else {
        throw new BadRequestException(error.message);
      }
    }
  }

  @Get(':slug/courses')
  @ApiImplicitParam({ name: 'slug', description: 'Slug can replace with id. Example : the-title or 049ddb16-9f0f-41a2-90e6-39b8768c8184' })
  @ApiImplicitQuery({ name: 'page', required: false })
  @ApiImplicitQuery({ name: 'per_page', required: false, enum: ['5', '10', '50', '100', '500', '1000', 'no-paginate'] })
  @ApiImplicitQuery({ name: 'keyword', required: false })
  @ApiImplicitQuery({ name: 'filter', required: false, enum: ['all', 'approved', 'waiting-approval', 'draft', 'trash'] })
  @ApiImplicitQuery({ name: 'sort_order', required: false, enum: ['ASC', 'DESC'] })
  @ApiImplicitQuery({ name: 'order_by', required: false, enum: ['sort_order', 'title', 'created_at', 'updated_at'] })
  async getListChild(@Param('slug') slug, @Query() query): Promise<object> {
    try {
      let track;
      if (validate(slug)) {
        track = await this.trackService.findOne({id: slug});

        if (!track) {
          throw new NotFoundException('Track is not found');
        }
      } else {
        track = await this.trackService.findOne({slug});

        if (!track) {
          throw new NotFoundException('Track is not found');
        }
      }

      // get list
      let perPage: number|string = 5;
      if (query.per_page) {
        perPage = query.per_page;
      } else {
        perPage = 5;
      }
      let orderBy;
      let sortOrder;
      if (query.order_by) {
        orderBy = query.order_by;
      } else {
        orderBy = 'sort_order';
      }
      if (query.sort_order === 'DESC' || query.sort_order === 'desc') {
        sortOrder = query.sort_order;
      } else {
        sortOrder = 'ASC';
      }
      query = {
        ...query,
        where: {
          track_id: track.id,
          deleted_at: null,
        },
        orderBy: [{
          column: orderBy,
          order: sortOrder,
        }],
      };

      let result = null;
      if (query.filter === 'approved') {
        query = {
          ...query,
          where: {
            ...query.where,
            approved: true,
            published: true,
          },
        };
      } else if (query.filter === 'waiting-approval') {
        query = {
          ...query,
          where: {
            ...query.where,
            approved: false,
            published: true,
          },
        };
      } else if (query.filter === 'draft') {
        query = {
          ...query,
          where: {
            ...query.where,
            approved: false,
            published: false,
          },
        };
      } else if (query.filter === 'trash') {
        query = {
          ...query,
          where: {
            ...query.where,
            deleted_at: 'IS NOT NULL',
          },
        };
      }

      if (perPage === 'no-paginate') {
        result = await this.courseService.findAll(query);

        // get list tracks by ids to calculate duration
        const ids: string[] = [];
        for (const value of result) {
          ids.push(value.id);
        }

        const list = await this.courseService.getListByIds(ids);

        // calculate duration
        for (const keyCourse in list) {
          if (true) {
            let totalDurationFromAllPlaylistInCourse = 0;
            for (const keyPlaylist in list[keyCourse].playlists) {
              if (true) {
                totalDurationFromAllPlaylistInCourse += list[keyCourse].playlists[keyPlaylist].duration;
              }
            }

            for (const i in result) {
              if (result[i].id === list[keyCourse].id) {
                result[i] = {
                  ...result[i],
                  duration: totalDurationFromAllPlaylistInCourse,
                };
              }
            }
          }
        }
        // end calculate duration
      } else {
        query = {
          ...query,
          per_page: Number(perPage),
        };
        result = await this.courseService.findAllWithPagination(query);

        // get list tracks by ids to calculate duration
        const ids: string[] = [];
        for (const value of result.data) {
          ids.push(value.id);
        }

        const list = await this.courseService.getListByIds(ids);

        // calculate duration
        for (const keyCourse in list) {
          if (true) {
            let totalDurationFromAllPlaylistInCourse = 0;
            for (const keyPlaylist in list[keyCourse].playlists) {
              if (true) {
                totalDurationFromAllPlaylistInCourse += list[keyCourse].playlists[keyPlaylist].duration;
              }
            }

            for (const i in result.data) {
              if (result.data[i].id === list[keyCourse].id) {
                result.data[i] = {
                  ...result.data[i],
                  duration: totalDurationFromAllPlaylistInCourse,
                };
              }
            }
          }
        }
        // end calculate duration
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

  @Post()
  async create(@Body() createDto: CreateTrackDto): Promise<object> {
    try {
      const userId = await this.authService.getUserId('author');
      const baseData = new Track();

      const slug = await this.generateSlug(createDto);
      createDto = {
        ...createDto,
        slug,
      };

      let createData: Track = Object.assign(baseData, createDto);
      // get last order
      const lastData: any = await this.trackService.getOneOrder('DESC');
      let nextOrder: number = 1;
      if (lastData.length > 0) {
        nextOrder = Number(lastData[0].sort_order) + 1;
      }

      // set nextOrder
      createData = {
        ...createData,
        id: uuid.v4(),
        user_id: userId,
        sort_order: nextOrder,
      };

      let result = await this.trackService.create(createData);

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

  @Put(':id')
  @ApiImplicitParam({ name: 'id' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateTrackDto): Promise<object> {
    try {
      const data = await updateDto;

      let result = await this.trackService.update(id, data);

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

  @Put(':id/change_image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiImplicitParam({ name: 'id', description: 'Example : c110f4d3-9f7f-4c70-990b-7a85aa77278e' })
  @ApiImplicitFile({ name: 'file' })
  async changeImage(@Param('id') id: string, @UploadedFile() file: any): Promise<object> {
    try {
      let track;
      track = await this.trackService.findOne({id});

      if (!track) {
        throw new NotFoundException('Track is not found');
      }

      // upload file to aws
      if (track.preview) {
        await this.awsService.delete('tracks', track.preview);
      }
      const uploaded: any = await this.awsService.upload('tracks', file);

      const updateData: UpdateTrackImageDto = {
        preview: getAssetURL('track', track.id, uploaded.fileName),
      };

      let result = await this.trackService.update(id, updateData);

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

  @Get(':slug/preview/:key')
  @ApiImplicitParam({ name: 'slug', description: 'Slug can replace with id. Example : the-title or 049ddb16-9f0f-41a2-90e6-39b8768c8184' })
  @ApiImplicitParam({ name: 'key', description: 'Key' })
  async previewImage(@Param('slug') slug, @Param('key') key, @Res() res) {
    try {
      let track;
      if (validate(slug)) {
        track = await this.trackService.findOne({id: slug});

        if (!track) {
          throw new NotFoundException('Not Found');
        }
      } else {
        track = await this.trackService.findOne({slug});

        if (!track) {
          throw new NotFoundException('Not Found');
        }
      }

      const result = await this.awsService.fetchOne('tracks', track.preview);

      const file = result;

      const filename = track.title;
      const mimetype = mime.lookup(file) ? mime.lookup(file) : track.type;

      res.setHeader('Content-disposition', 'attachment; filename=' + filename);
      res.setHeader('Content-type', mimetype);

      res.download(file, filename);

      // track = convertDate(track);
      // return convertResponse(track);
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
      const data = await this.trackService.findOne({id});

      let from = 0;
      let to = 0;

      const firstData: any = await this.trackService.getOneOrder('ASC');
      const lastData: any = await this.trackService.getOneOrder('DESC');
      from = data.sort_order;
      to = lastData[0].sort_order;
      // console.info(firstData[0].sort_order + ' - ' + lastData[0].sort_order);
      await this.trackService.replaceOrderBetween('minus', from, to);

      let result = await this.trackService.delete(id);
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

  @Put(':id/restore')
  @ApiImplicitParam({ name: 'id' })
  async restore(@Param('id') id: string): Promise<object> {
    try {
      const lastSort = await this.trackService.getOneOrder('DESC');
      let restore: any = await this.trackService.restore(id);
      restore = {
        ...restore,
        sort_order : lastSort[0].sort_order + 1,
      };
      let result = await this.trackService.update(id, restore);

      result = convertDate(lastSort);
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

  @Delete(':id/force')
  @ApiImplicitParam({ name: 'id' })
  async forceDelete(@Param('id') id: string): Promise<object> {
    try {
      let result = await this.trackService.forceDelete(id);

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

  @Put(':id/addcourse')
  @ApiImplicitParam({ name: 'id' })
  async addCourseToTrack(@Param('id') id: string, @Body() addTrackCourseDto: AddTrackCourseDto): Promise<object> {
    try {
      const data = await addTrackCourseDto;
      for (const course of data.courses) {
        await this.trackService.addTrackOnCourse(id, course);
      }
      const result = convertDate(data);
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

  @Put(':id/removecourse')
  @ApiImplicitParam({ name: 'id' })
  async removeCourseFromTrack(@Param('id') id: string, @Body() addTrackCourseDto: AddTrackCourseDto): Promise<object> {
    try {
      const data = await addTrackCourseDto;
      for (const course of data.courses) {
        await this.trackService.removeTrackOnCourse(id, course);
      }
      const result = convertDate(data);
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

  @Patch(':id/order')
  @ApiImplicitParam({ name: 'id' })
  async changeOrder(@Param('id') id: string, @Body() changeTrackOrder: ChangeTrackOrder): Promise<object> {
    try {
      const data: any = await changeTrackOrder;
      const findData = await this.trackService.findOne({
        id,
      });

      let from = findData.sort_order; let to = data.sort_order; let operator = 'minus';
      if (data.sort_order < findData.sort_order) {
        from = data.sort_order; to = findData.sort_order; operator = 'plus';
      }
      const dataSet = await this.trackService.findBetween(from, to);

      for (const dtSet of dataSet) {
        const changeTo = {
          id: dtSet.id,
          sort_order: operator === 'minus' ? dtSet.sort_order - 1 : dtSet.sort_order + 1,
        };

        if (id === dtSet.id) { changeTo.sort_order = data.sort_order; }
        await this.trackService.changeOrder(changeTo);
      }

      let result = await this.trackService.findBetween(from, to);
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

  async generateSlug(createDto: CreateTrackDto): Promise<string> {
    try {
      let slug = createDto.slug;
      const title = createDto.title;
      // if slug is not set, generate slug
      if (!slug) {
        slug = slugify(title);
      }

      // if slug is set, check slug is exist or not
      const findOneSlugExist = await this.trackService.findOneWithTrash({slug});
      if (findOneSlugExist) {
        const query = {
          like: {
            slug,
          },
        };
        const findAllSlugExist = await this.trackService.findAll(query); // find also in trash

        if (findAllSlugExist.length > 0) {
          slug = slug + '-' + (findAllSlugExist.length + 1);
        }

        // replace createDto
        createDto = {
          ...createDto,
          slug,
        };
        return await this.generateSlug(createDto);
      } else {
        return slug;
      }
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
