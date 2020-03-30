import { Controller, Get, Post, Body, Param,
  NotFoundException } from '@nestjs/common';
import { ApiImplicitParam, ApiImplicitQuery, ApiUseTags } from '@nestjs/swagger';
import { CourseCompletionService } from '../../providers/coursecompletion/coursecompletion.service';
import { convertResponse, convertDate } from '../_plugins/converter';
import { slugify } from '../_plugins/slugify';
import { CourseService } from '../../providers/course/course.service';
import * as validate from 'uuid-validate';
import { AuthService } from '../../_handler/auth/auth.service';

@ApiUseTags('Completion')
@Controller('course')
export class CourseCompletionController {
  private readonly authService: AuthService;
  constructor(private readonly courseCompletionService: CourseCompletionService,
              private readonly courseService: CourseService) {
                this.authService = new AuthService();
              }

  @Get(':slug/completion')
  @ApiImplicitParam({ name: 'slug', description: 'Slug can replace with id. Example : the-title or 049ddb16-9f0f-41a2-90e6-39b8768c8184' })
  async findOne(@Param('slug') slug): Promise<object> {
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

    // Get Course Completion
    let result;
    result = await this.courseCompletionService.findOne({course_id: course.id, user_id: userId});

    if (!result) {
      throw new NotFoundException('Course Completion is not found');
    }

    result = convertDate(result);
    return convertResponse(result);
  }
}
