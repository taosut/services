import { Controller, Get, Post, Body, Param,
  NotFoundException, BadRequestException,
  Query, Put, Delete, HttpException, Patch, UseInterceptors, UploadedFile, Res, Logger } from '@nestjs/common';
import { CourseService } from '../../providers/course/course.service';
import { Course } from '../../models/course/course.entity';
import { CreateCourseDto, UpdateCourseDto, ChangeCourseOrder,
  UpdateCourseImageDto, UpdateApprovalDto, UpdatePublicationDto  } from '../../models/course/course.dto';
import { ApiImplicitParam, ApiImplicitQuery, ApiUseTags, ApiConsumes, ApiImplicitFile } from '@nestjs/swagger';
import { convertResponse, convertDate } from '../_plugins/converter';
import { PlaylistService } from '../../providers/playlist/playlist.service';
import { slugify } from '../_plugins/slugify';
import * as validate from 'uuid-validate';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsService } from '../../_handler/aws/aws.service';
import { Playlist } from '../../models/playlist/playlist.entity';
import { AuthService } from '../../_handler/auth/auth.service';
import uuid = require('uuid');
import { Like, Raw } from 'typeorm';

// tslint:disable-next-line: no-const-requires
// tslint:disable-next-line: no-var-requires
const mime = require('mime');

@ApiUseTags('Course')
@Controller('course')
export class CourseController {
  private readonly authService: AuthService;
  private readonly awsService: AwsService;
  constructor(private readonly courseService: CourseService, private readonly playlistService: PlaylistService) {
    this.awsService = new AwsService();
    this.authService = new AuthService();
  }

  @Get()
  @ApiImplicitQuery({ name: 'page', required: false })
  @ApiImplicitQuery({ name: 'per_page', required: false, enum: ['5', '10', '50', '100', '500', '1000', 'no-paginate'] })
  @ApiImplicitQuery({ name: 'keyword', required: false })
  @ApiImplicitQuery({ name: 'filter', required: false, enum: ['all', 'approved', 'waiting-approval', 'draft', 'trash'] })
  @ApiImplicitQuery({ name: 'sort_order', required: false, enum: ['ASC', 'DESC'] })
  @ApiImplicitQuery({ name: 'order_by', required: false, enum: ['sort_order', 'title', 'created_at', 'updated_at'] })
  async findAll(@Query() query): Promise<object> {
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
      if (query.filter === 'approved') {
        query = {
          ...query,
          where: {
            approved: true,
            published: true,
          },
        };
      } else if (query.filter === 'waiting-approval') {
        query = {
          ...query,
          where: {
            approved: false,
            published: true,
          },
        };
      } else if (query.filter === 'draft') {
        query = {
          ...query,
          where: {
            approved: false,
            published: false,
          },
        };
      } else if (query.filter === 'trash') {
        query = {
          ...query,
          where: {
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

  @Get(':slug')
  @ApiImplicitParam({ name: 'slug', description: 'Slug can replace with id. Example : the-title or 049ddb16-9f0f-41a2-90e6-39b8768c8184' })
  async findOne(@Param('slug') slug): Promise<object> {
    try {
      let course;
      if (validate(slug)) {
        course = await this.courseService.findOne({id: slug});

        let totalDurationFromAllPlaylistInCourse = 0;
        for (const keyPlaylist in course.playlists) {
          if (true) {
            totalDurationFromAllPlaylistInCourse += course.playlists[keyPlaylist].duration;
          }
        }

        course = {
          ...course,
          duration: totalDurationFromAllPlaylistInCourse,
        };
        delete course.playlists;
        if (!course) {
          throw new NotFoundException('Not Found');
        }
      } else {
        course = await this.courseService.findOne({slug});

        if (!course) {
          throw new NotFoundException('Not Found');
        }
      }

      course = convertDate(course);
      return convertResponse(course);
    } catch (error) {
      Logger.error(JSON.stringify(error));
      if (error.statusCode) {
        throw new HttpException(error.message, error.statusCode);
      } else {
        throw new BadRequestException(error.message);
      }
    }
  }

  @Get(':slug/preview')
  @ApiImplicitParam({ name: 'slug', description: 'Slug can replace with id. Example : the-title or 049ddb16-9f0f-41a2-90e6-39b8768c8184' })
  async previewImage(@Param('slug') slug, @Res() res): Promise<object> {
    try {
      let course;
      if (validate(slug)) {
        course = await this.courseService.findOne({id: slug});

        if (!course) {
          throw new NotFoundException('Not Found');
        }
      } else {
        course = await this.courseService.findOne({slug});

        if (!course) {
          throw new NotFoundException('Not Found');
        }
      }

      const result = await this.awsService.fetchOne('courses', course.preview);

      const file = result;

      const filename = course.title;
      const mimetype = mime.lookup(file) ? mime.lookup(file) : course.type;

      res.setHeader('Content-disposition', 'attachment; filename=' + filename);
      res.setHeader('Content-type', mimetype);

      res.download(file, filename);

      course = convertDate(course);
      return convertResponse(course);
    } catch (error) {
      Logger.error(JSON.stringify(error));
      if (error.statusCode) {
        throw new HttpException(error.message, error.statusCode);
      } else {
        throw new BadRequestException(error.message);
      }
    }
  }

  @Get(':slug/playlists')
  @ApiImplicitParam({ name: 'slug', description: 'Slug can replace with id. Example : the-title or 049ddb16-9f0f-41a2-90e6-39b8768c8184' })
  @ApiImplicitQuery({ name: 'page', required: false })
  @ApiImplicitQuery({ name: 'per_page', required: false, enum: ['5', '10', '50', '100', '500', '1000', 'no-paginate'] })
  @ApiImplicitQuery({ name: 'keyword', required: false })
  @ApiImplicitQuery({ name: 'filter', required: false, enum: ['all', 'trash'] })
  @ApiImplicitQuery({ name: 'sort_order', required: false, enum: ['ASC', 'DESC'] })
  @ApiImplicitQuery({ name: 'order_by', required: false, enum: ['sort_order', 'title', 'created_at', 'updated_at'] })
  async getListChild(@Param('slug') slug, @Query() query): Promise<object> {
    try {
      let course;
      if (validate(slug)) {
        course = await this.courseService.findOne({id: slug});

        if (!course) {
          throw new NotFoundException('Course is not found');
        }
      } else {
        course = await this.courseService.findOne({slug});

        if (!course) {
          throw new NotFoundException('Course is not found');
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
          course_id: course.id,
          deleted_at: null,
        },
        orderBy: [{
          column: orderBy,
          order: sortOrder,
        }],
      };

      let result = null;
      if (query.filter === 'trash') {
        query = {
          ...query,
          where: {
            ...query.where,
            deleted_at: 'IS NOT NULL',
          },
        };
      }

      if (perPage === 'no-paginate') {
        result = await this.playlistService.findAll(query);
      } else {
        query = {
          ...query,
          per_page: Number(perPage),
        };
        result = await this.playlistService.findAllWithPagination(query);
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
  async create(@Body() createDto: CreateCourseDto): Promise<object> {
    try {
      const userId = await this.authService.getUserId('author');
      const baseData = new Course();

      const slug = await this.generateSlug(createDto);
      createDto = {
        ...createDto,
        slug,
      };

      let createData: Course = Object.assign(baseData, createDto);

      // get last order
      const lastData: any = await this.courseService.getOneOrder(createData.track_id, 'DESC');
      let nextOrder: number = 1;
      if (lastData.length > 0) {
        nextOrder = Number(lastData[0].sort_order) + 1;
      }
      // force published and approved as false, set nextOrder
      createData = {
        ...createData,
        id: uuid.v4(),
        published: false,
        approved: false,
        user_id: userId,
        sort_order: nextOrder,
      };

      let result = await this.courseService.create(createData);
      let createdPlaylist;

      if (result) {
        let playlistData: Playlist = new Playlist();
        playlistData = {
          ...playlistData,
          id: uuid.v4(),
          title: 'First Playlist',
          slug: 'first-playlist-in-' + createData.slug,
          course_id: result.id,
        };
        createdPlaylist = await this.playlistService.create(playlistData);
      }

      result = {
        ...result,
        playlists: [ createdPlaylist ],
      };

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
  async update(@Param('id') id: string, @Body() updateDto: UpdateCourseDto): Promise<object> {
    try {
      const data = await updateDto;

      let result = await this.courseService.update(id, data);

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
      track = await this.courseService.findOne({id});

      if (!track) {
        throw new NotFoundException('Course is not found');
      }

      // upload file to aws
      const uploaded: any = await this.awsService.upload('courses', file);

      const updateData: UpdateCourseImageDto = {
        preview: uploaded.fileName,
      };

      let result = await this.courseService.update(id, updateData);

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

  @Delete(':id')
  @ApiImplicitParam({ name: 'id' })
  async delete(@Param('id') id: string): Promise<object> {
    try {
      const data = await this.courseService.findOne({id});

      let from = 0;
      let to = 0;

      const lastData: any = await this.courseService.getOneOrder(data.track_id, 'DESC');
      from = data.sort_order;
      to = lastData[0].sort_order;
      await this.courseService.replaceOrderBetween(data.track_id, 'minus', from, to);

      let result = await this.courseService.delete(id);

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
      const data = await this.courseService.findOneWithTrash({id});
      const lastSort = await this.courseService.getOneOrder(data.track_id, 'DESC');
      let restore: any = await this.courseService.restore(id);
      restore = {
        ...restore,
        sort_order : lastSort[0].sort_order + 1,
      };
      let result = await this.courseService.update(id, restore);
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

  @Delete(':id/force')
  @ApiImplicitParam({ name: 'id' })
  async forceDelete(@Param('id') id: string): Promise<object> {
    try {
      let result = await this.courseService.forceDelete(id);

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

  @Patch(':id/order')
  @ApiImplicitParam({ name: 'id' })
  async changeOrder(@Param('id') id: string, @Body() changeCourseOrder: ChangeCourseOrder): Promise<object> {
    try {
      const data: any = await changeCourseOrder;
      const findData = await this.courseService.findOne({
        id,
      });

      let from = findData.sort_order; let to = data.sort_order; let operator = 'minus';
      if (data.sort_order < findData.sort_order) {
        from = data.sort_order; to = findData.sort_order; operator = 'plus';
      }
      const dataSet = await this.courseService.findBetween(from, to, findData.track_id);

      for (const dtSet of dataSet) {
        const changeTo = {
          id: dtSet.id,
          sort_order: operator === 'minus' ? dtSet.sort_order - 1 : dtSet.sort_order + 1,
        };

        if (id === dtSet.id) { changeTo.sort_order = data.sort_order; }
        await this.courseService.changeOrder(changeTo);
      }

      let result = await this.courseService.findBetween(from, to, findData.track_id);
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

  @Patch(':id/approval')
  @ApiImplicitParam({ name: 'id' })
  async approval(@Param('id') id: string, @Body() updateApprovalDto: UpdateApprovalDto): Promise<object> {
    try {
      const data: any = await updateApprovalDto;

      let result = await this.courseService.changeApproval(id, data);
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

  @Patch(':id/publication')
  @ApiImplicitParam({ name: 'id' })
  async publication(@Param('id') id: string, @Body() updatePublicationDto: UpdatePublicationDto): Promise<object> {
    try {
      const data: any = await updatePublicationDto;

      let result = await this.courseService.changePublication(id, data);
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

  async generateSlug(createDto: CreateCourseDto): Promise<string> {
    try {
      let slug = createDto.slug;
      const title = createDto.title;
      // if slug is not set, generate slug
      if (!slug) {
        slug = slugify(title);
      }

      // if slug is set, check slug is exist or not
      const findOneSlugExist = await this.courseService.findOneWithTrash({slug});
      if (findOneSlugExist) {
        const query = {
          like: {
            slug,
          },
        };
        const findAllSlugExist = await this.courseService.findAll(query); // find also in trash

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
