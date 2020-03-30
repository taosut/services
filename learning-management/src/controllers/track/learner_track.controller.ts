import { Controller, Get, BadRequestException,
  Query, HttpException, Param, NotFoundException, Logger } from '@nestjs/common';
import { TrackService } from '../../providers/track/track.service';
import { ApiImplicitQuery, ApiUseTags, ApiImplicitParam } from '@nestjs/swagger';
import { convertResponse, convertDate, getAssetURL } from '../_plugins/converter';
import { AuthService } from '../../_handler/auth/auth.service';
import * as validate from 'uuid-validate';
import { CourseService } from '../../providers/course/course.service';

@ApiUseTags('[Learner] Track')
@Controller('learner/track')
export class LearnerTrackController {
  private readonly authService: AuthService;
  constructor(private readonly trackService: TrackService, private readonly courseService: CourseService) {
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
        result = result.map(item => {
          return {
            ...item,
            preview: getAssetURL('track', item.id, item.preview),
          };
        });

        // get list tracks by ids to calculate duration
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
        result.data = result.data.map(item => {
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
      if (error.statusCode) {
        throw new HttpException(error.message, error.statusCode);
      } else {
        throw new BadRequestException(error.message);
      }
    }
  }

  @Get(':slug/courses')
  @ApiImplicitQuery({ name: 'page', required: false })
  @ApiImplicitQuery({ name: 'per_page', required: false, enum: ['5', '10', '50', '100', '500', '1000', 'no-paginate'] })
  @ApiImplicitQuery({ name: 'keyword', required: false })
  @ApiImplicitQuery({ name: 'filter', required: false, enum: ['all', 'has-joined', 'has-not-joined'] })
  @ApiImplicitQuery({ name: 'sort_order', required: false, enum: ['ASC', 'DESC'] })
  @ApiImplicitQuery({ name: 'order_by', required: false, enum: ['sort_order', 'title', 'created_at', 'updated_at'] })
  @ApiImplicitParam({ name: 'slug', description: 'Slug can replace with id. Example : the-title or 049ddb16-9f0f-41a2-90e6-39b8768c8184' })
  async getListChild(@Param('slug') slug, @Query() query) {
    try {
      const userId = await this.authService.getUserId('learner');

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
          track_id: track.id,
          deleted_at: null,
          published: true,
          approved: true,
        },
        orderBy: [{
          column: orderBy,
          order: sortOrder,
        }],
      };

      if (query.filter === 'has-joined') {
        query = {
          ...query,
          learner_has_joined: true,
        };
      } else if (query.filter === 'has-not-joined') {
        query = {
          ...query,
          learner_has_joined: false,
        };
      }

      let result = null;

      if (perPage === 'no-paginate') {
        result = await this.courseService.findAll(query);
        result = result.map(item => {
          return {
            ...item,
            preview: getAssetURL('course', item.id, item.preview),
          };
        });

        // calculate duration
        let totalDurationFromAllCourseInTrack = 0;
        for (const keyCourse in result) {
          if (true) {
            let totalDurationFromAllPlaylistInCourse = 0;
            for (const keyPlaylist in result[keyCourse].playlists) {
              if (true) {
                totalDurationFromAllPlaylistInCourse += result[keyCourse].playlists[keyPlaylist].duration;
              }
            }

            result[keyCourse] = {
              ...result[keyCourse],
              duration: totalDurationFromAllPlaylistInCourse,
            };
            delete result[keyCourse].playlists;
            totalDurationFromAllCourseInTrack += totalDurationFromAllPlaylistInCourse;
          }
        }
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

        // calculate duration
        let totalDurationFromAllCourseInTrack = 0;
        for (const keyCourse in result.data) {
          if (true) {
            let totalDurationFromAllPlaylistInCourse = 0;
            for (const keyPlaylist in result.data[keyCourse].playlists) {
              if (true) {
                totalDurationFromAllPlaylistInCourse += result.data[keyCourse].playlists[keyPlaylist].duration;
              }
            }

            result.data[keyCourse] = {
              ...result.data[keyCourse],
              duration: totalDurationFromAllPlaylistInCourse,
            };
            delete result.data[keyCourse].playlists;
            totalDurationFromAllCourseInTrack += totalDurationFromAllPlaylistInCourse;
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
}
