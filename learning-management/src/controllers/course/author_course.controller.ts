import { Controller, Get, BadRequestException,
  Query, HttpException, Param, NotFoundException, Post, Logger, Put } from '@nestjs/common';
import { CourseService } from '../../providers/course/course.service';
import { ApiImplicitQuery, ApiUseTags, ApiImplicitParam } from '@nestjs/swagger';
import { convertResponse, convertDate, getAssetURL } from '../_plugins/converter';
import { AuthService } from '../../_handler/auth/auth.service';
import * as validate from 'uuid-validate';
import { CourseUserService } from '../../providers/courseuser/courseuser.service';
import { PlaylistService } from '../../providers/playlist/playlist.service';

@ApiUseTags('[Author] Course')
@Controller('author/course')
export class AuthorCourseController {
  private readonly authService: AuthService;
  constructor(private readonly courseService: CourseService,
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
      const userId = await this.authService.getUserId('author');
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
          user_id: userId,
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
