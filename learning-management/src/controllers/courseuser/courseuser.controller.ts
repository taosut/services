import { Controller, Get, Post, Body, Param, NotFoundException, BadRequestException, Query, HttpException, Logger } from '@nestjs/common';
import { CourseUserService } from '../../providers/courseuser/courseuser.service';
import { CourseUser } from '../../models/courseuser/courseuser.entity';
import { UpdateCourseUserDto } from '../../models/courseuser/courseuser.dto';
import { ApiImplicitParam, ApiImplicitQuery, ApiUseTags } from '@nestjs/swagger';
import { convertResponse, convertDate } from '../_plugins/converter';
import { CourseService } from '../../providers/course/course.service';
import * as validate from 'uuid-validate';

@ApiUseTags('Course Member Management')
@Controller('course')
export class CourseUserController {
  constructor(private readonly courseUserService: CourseUserService, private readonly courseService: CourseService) {}

  @Get(':slug/member')
  @ApiImplicitParam({ name: 'slug', description: 'Slug can replace with id. Example : the-title or 049ddb16-9f0f-41a2-90e6-39b8768c8184' })
  @ApiImplicitQuery({ name: 'page', required: false })
  @ApiImplicitQuery({ name: 'per_page', required: false, enum: ['5', '10', '50', '100', '500', '1000', 'no-paginate'] })
  @ApiImplicitQuery({ name: 'keyword', required: false })
  @ApiImplicitQuery({ name: 'filter', required: false, enum: ['all'] })
  async findAll(@Param('slug') slug, @Query() query): Promise<object> {
    // check course
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
    // get list member
    let perPage: number|string = 5;
    if (query.per_page) {
      perPage = query.per_page;
    } else {
      perPage = 5;
    }

    query = {
      ...query,
      where: {
        course_id: course.id,
      },
    };
    let result = null;

    if (perPage === 'no-paginate') {
      result = await this.courseUserService.findAll(query);
    } else {
      query = {
        ...query,
        per_page: Number(perPage),
      };
      result = await this.courseUserService.findAllWithPagination(query);
    }

    result = convertDate(result);
    return convertResponse(result);
  }

  @Post(':id/member')
  @ApiImplicitParam({ name: 'id', description: 'Example : 049ddb16-9f0f-41a2-90e6-39b8768c8184' })
  async updateMember(@Param('id') id, @Body() body: UpdateCourseUserDto): Promise<object> {
    try {
      // check course
      let course;
      course = await this.courseService.findOne({id});

      if (!course) {
        Logger.error('Course is not found');
        throw new NotFoundException('Not Found');
      }
      Logger.error('Course is found');

      /**
       * Body
       * {
       *  add_member: [],
       *  remove_member: [],
       * }
       */
      if (body.remove_member && Array.isArray(body.remove_member)) {
        for (const item of body.remove_member) {
          const deleted = this.courseUserService.forceDelete({course_id: id, user_id: item});
          if (deleted) {
            Logger.debug('User ' + item + ' was successfully deleted');
          } else {
            Logger.error('User ' + item + ' was failed to deleted');
          }
        }
      }

      if (body.add_member && Array.isArray(body.add_member)) {
        const listNewMember: CourseUser[] = body.add_member.map((userId: string) => {
          const baseData = new CourseUser();
          const data = {
            course_id: course.id,
            user_id: userId,
          };
          const createData: CourseUser = Object.assign(baseData, data);
          return createData;
        });

        const createMultiple = await this.courseUserService.createMultiple(listNewMember);
        if (createMultiple) {
          Logger.debug('User [' + listNewMember.join(', ') + '] was successfully added');
        } else {
          Logger.error('User [' + listNewMember.join(', ') + '] was failed to deleted');
        }
      }

      const query = {
        page: 1,
        per_page: 5,
      };
      Logger.debug('Get list of updated members');
      return await this.findAll(course.id, query);
    } catch (error) {
      if (error.statusCode) {
        throw new HttpException(error.message, error.statusCode);
      } else {
        throw new BadRequestException(error.message);
      }
    }
  }

  // @Put(':id/member_replace')
  // async replaceMember(@Body() body): Promise<object> {
  //   try {
  //     let result;
  //     /**
  //      * Body
  //      * {
  //      *  list_member: [],
  //      * }
  //      */
  //     if (body.list_member && Array.isArray(body.list_member)) {

  //     }

  //     result = convertDate(result);
  //     return convertResponse(result);
  //   } catch(error) {
  //     if (error.statusCode) throw new HttpException(error.message, error.statusCode);
  //     else throw new BadRequestException(error.message);
  //   }
  // }

  // @Delete(':id/force')
  // @ApiImplicitParam({ name: 'id' })
  // async forceDelete(@Param('id') id: string): Promise<object> {
  //   try {
  //     let result = await this.courseUserService.forceDelete(id);

  //     result = convertDate(result);
  //     return convertResponse(result);
  //   } catch(error) {
  //     if (error.statusCode) throw new HttpException(error.message, error.statusCode);
  //     else throw new BadRequestException(error.message);
  //   }
  // }
}
