import { Controller, Get, BadRequestException,
  Query, HttpException, Param, NotFoundException, Post, Logger, Put } from '@nestjs/common';
import { CourseService } from '../../providers/course/course.service';
import { ApiImplicitQuery, ApiUseTags, ApiImplicitParam } from '@nestjs/swagger';
import { convertResponse, convertDate, getAssetURL } from '../_plugins/converter';
import { AuthService } from '../../_handler/auth/auth.service';
import * as validate from 'uuid-validate';
import { CourseUserService } from '../../providers/courseuser/courseuser.service';
import { PlaylistService } from '../../providers/playlist/playlist.service';

@ApiUseTags('[Learner] Course')
@Controller('learner/course')
export class LearnerCourseController {
  private readonly authService: AuthService;
  constructor(private readonly courseService: CourseService,
              private readonly courseUserService: CourseUserService,
              private readonly playlistService: PlaylistService) {
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
      const userId = await this.authService.getUserId('learner');
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
        learner_id: userId,
        where: {
          deleted_at: null,
          published: true,
          approved: true,
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
        result = await this.courseService.findAll(query);
        result = result.map(item => {
          return {
            ...item,
            preview: getAssetURL('course', item.id, item.preview),
          };
        });

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
        result.data = result.data.map(item => {
          return {
            ...item,
            preview: getAssetURL('course', item.id, item.preview),
          };
        });

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

  @Put(':slug/join')
  @ApiImplicitParam({ name: 'slug', description: 'Slug can replace with id. Example : the-title or 049ddb16-9f0f-41a2-90e6-39b8768c8184' })
  async joinCourse(@Param('slug') slug): Promise<object> {
    try {
      const userId = await this.authService.getUserId('learner');
      let course;
      if (validate(slug)) {
        course = await this.courseService.findOne({id: slug});

        if (!course) {
            throw new NotFoundException('Course is not Found');
        }
      } else {
        course = await this.courseService.findOne({slug});

        if (!course) {
          throw new NotFoundException('Course is not Found');
        }
      }

      const courseUser = await this.courseUserService.findOne({course_id: course.id, user_id: userId});

      if (!courseUser) {
        throw new BadRequestException('You are not allowed to join this course');
      }

      const updateData = {
        has_joined: true,
      };

      let result = await this.courseUserService.update(courseUser.id, updateData);

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
}
