import { Controller, Get, Post, Body, Param,
  NotFoundException, BadRequestException, Query, Put, Delete, HttpException, Patch, Logger, Inject, forwardRef } from '@nestjs/common';
import { FinalExamService } from '../../providers/final_exam/final_exam.service';
import { FinalExam } from '../../models/final_exam/final_exam.entity';
import { CreateFinalExamDto, UpdateFinalExamDto } from '../../models/final_exam/final_exam.dto';
import { ApiImplicitParam, ApiImplicitQuery, ApiUseTags } from '@nestjs/swagger';
import { convertResponse, convertDate } from '../_plugins/converter';
import { slugify } from '../_plugins/slugify';
import * as validate from 'uuid-validate';
import uuid = require('uuid');
import { FinalExamQuestionService } from '../../providers/final_exam_question/final_exam_question.service';

@ApiUseTags('Final Exam')
@Controller('final_exam')
export class FinalExamController {
  constructor(private readonly finalExamService: FinalExamService,
              private readonly finalExamQuestionService: FinalExamQuestionService) {}

  @Get()
  @ApiImplicitQuery({ name: 'page', required: false })
  @ApiImplicitQuery({ name: 'per_page', required: false, enum: ['5', '10', '50', '100', '500', '1000', 'no-paginate'] })
  @ApiImplicitQuery({ name: 'keyword', required: false })
  @ApiImplicitQuery({ name: 'filter', required: false, enum: ['all', 'trash'] })
  @ApiImplicitQuery({ name: 'sort_order', required: false, enum: ['ASC', 'DESC'] })
  @ApiImplicitQuery({ name: 'order_by', required: false, enum: ['title', 'created_at', 'updated_at'] })
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
        orderBy = 'created_at';
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
      if (query.filter === 'trash') {
        query = {
          ...query,
          where: {
            deleted_at: 'IS NOT NULL',
          },
        };
      }

      if (perPage === 'no-paginate') {
        result = await this.finalExamService.findAll(query);
      } else {
        query = {
          ...query,
          per_page: Number(perPage),
        };
        result = await this.finalExamService.findAllWithPagination(query);
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
  @ApiImplicitQuery({ name: 'with_questions', type: 'boolean', required: false })
  async findOne(@Param('slug') slug, @Query() query): Promise<object> {
    try {
      let finalExam;
      if (validate(slug)) {
        finalExam = await this.finalExamService.findOne({id: slug});

        if (!finalExam) {
          throw new NotFoundException('Not Found');
        }
      } else {
        finalExam = await this.finalExamService.findOne({slug});

        if (!finalExam) {
          throw new NotFoundException('Not Found');
        }
      }

      // get list questions
      if (query.with_questions === true || query.with_questions === 'true') {
        query = {
          where: {
            final_exam_id: finalExam.id,
            deleted_at: null,
          },
        };
        const questions = await this.finalExamQuestionService.findAll(query);
        finalExam = {
          ...finalExam,
          questions,
        };
      }

      finalExam = convertDate(finalExam);
      return convertResponse(finalExam);
    } catch (error) {
      Logger.error(JSON.stringify(error));
      if (error.statusCode) {
        throw new HttpException(error.message, error.statusCode);
      } else {
        throw new BadRequestException(error.message);
      }
    }
  }

  @Get(':slug/questions')
  @ApiImplicitParam({ name: 'slug', description: 'Slug can replace with id. Example : the-title or 049ddb16-9f0f-41a2-90e6-39b8768c8184' })
  @ApiImplicitQuery({ name: 'page', required: false })
  @ApiImplicitQuery({ name: 'per_page', required: false, enum: ['5', '10', '50', '100', '500', '1000', 'no-paginate'] })
  @ApiImplicitQuery({ name: 'keyword', required: false })
  @ApiImplicitQuery({ name: 'filter', required: false, enum: ['all', 'trash'] })
  async findOneWithQuestion(@Query() query, @Param('slug') slug): Promise<object> {
    try {
      let finalExam;
      if (validate(slug)) {
        finalExam = await this.finalExamService.findOne({id: slug});

        if (!finalExam) {
          throw new NotFoundException('Not Found');
        }
      } else {
        finalExam = await this.finalExamService.findOne({slug});

        if (!finalExam) {
          throw new NotFoundException('Not Found');
        }
      }

      // get question list
      let perPage: number|string = 5;
      if (query.per_page) {
        perPage = query.per_page;
      } else {
        perPage = 5;
      }

      query = {
        ...query,
        where: {
          final_exam_id: finalExam.id,
          deleted_at: null,
        },
      };
      let result = null;
      if (query.filter === 'trash') {
        query = {
          ...query,
          where: {
            deleted_at: 'IS NOT NULL',
          },
        };
      }

      if (perPage === 'no-paginate') {
        result = await this.finalExamQuestionService.findAll(query);
      } else {
        query = {
          ...query,
          per_page: Number(perPage),
        };
        result = await this.finalExamQuestionService.findAllWithPagination(query);
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
  async create(@Body() createDto: CreateFinalExamDto): Promise<object> {
    try {
      const baseData = new FinalExam();

      const slug = await this.generateSlug(createDto);
      createDto = {
        ...createDto,
        slug,
      };

      let createData: FinalExam = Object.assign(baseData, createDto);

      createData = {
        ...createData,
        id: uuid.v4(),
      };

      let result = await this.finalExamService.create(createData);

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
  async update(@Param('id') id: string, @Body() updateDto: UpdateFinalExamDto): Promise<object> {
    try {
      const data = await updateDto;

      let result = await this.finalExamService.update(id, data);

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
      let result = await this.finalExamService.delete(id);

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
      let result: any = await this.finalExamService.restore(id);

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
      let result = await this.finalExamService.forceDelete(id);

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

  // Additional Function
  async generateSlug(createDto: CreateFinalExamDto): Promise<string> {
    try {
      let slug = createDto.slug;
      const title = createDto.title;
      // if slug is not set, generate slug
      if (!slug) {
        slug = slugify(title);
      }

      // if slug is set, check slug is exist or not
      const findOneSlugExist = await this.finalExamService.findOneWithTrash({slug});
      if (findOneSlugExist) {
        const query = {
          like: {
            slug,
          },
        };
        const findAllSlugExist = await this.finalExamService.findAll(query); // find also in trash

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
