import { Controller, Get, Post, Body, Param,
  NotFoundException, BadRequestException, Query, Put, Delete, HttpException, Patch, Logger } from '@nestjs/common';
import { LessonService } from '../../providers/lesson/lesson.service';
import { Lesson } from '../../models/lesson/lesson.entity';
import { CreateLessonDto, UpdateLessonDto, ChangeLessonOrder } from '../../models/lesson/lesson.dto';
import { ApiImplicitParam, ApiImplicitQuery, ApiUseTags } from '@nestjs/swagger';
import { convertResponse, convertDate } from '../_plugins/converter';
import { slugify } from '../_plugins/slugify';
import * as validate from 'uuid-validate';
import uuid = require('uuid');

@ApiUseTags('Lesson')
@Controller('lesson')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Get()
  @ApiImplicitQuery({ name: 'page', required: false })
  @ApiImplicitQuery({ name: 'per_page', required: false, enum: ['5', '10', '50', '100', '500', '1000', 'no-paginate'] })
  @ApiImplicitQuery({ name: 'keyword', required: false })
  @ApiImplicitQuery({ name: 'filter', required: false, enum: ['all', 'trash'] })
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
      if (query.filter === 'trash') {
        query = {
          ...query,
          where: {
            deleted_at: 'IS NOT NULL',
          },
        };
      }

      if (perPage === 'no-paginate') {
        result = await this.lessonService.findAll(query);
      } else {
        query = {
          ...query,
          per_page: Number(perPage),
        };
        result = await this.lessonService.findAllWithPagination(query);
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
      let lesson;
      if (validate(slug)) {
        lesson = await this.lessonService.findOne({id: slug});

        if (!lesson) {
          throw new NotFoundException('Not Found');
        }
      } else {
        lesson = await this.lessonService.findOne({slug});

        if (lesson) {
          throw new NotFoundException('Not Found');
        }
      }

      lesson = convertDate(lesson);
      return convertResponse(lesson);
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
  async create(@Body() createDto: CreateLessonDto): Promise<object> {
    try {
      const arrLessonType = [ 'lecture', 'quiz' ];
      const baseData = new Lesson();

      const slug = await this.generateSlug(createDto);
      createDto = {
        ...createDto,
        slug,
      };
      if (!createDto.lesson_type || (createDto.lesson_type && !arrLessonType.find(item => item === createDto.lesson_type))) {
        createDto = {
          ...createDto,
          lesson_type: 'lecture',
        };
      }

      let createData: Lesson = Object.assign(baseData, createDto);

      // get last order
      const lastData: any = await this.lessonService.getOneOrder(createData.playlist_id, 'DESC');
      let nextOrder: number = 1;
      if (lastData.length > 0) {
        nextOrder = Number(lastData[0].sort_order) + 1;
      }
      createData = {
        ...createData,
        id: uuid.v4(),
        sort_order: nextOrder,
      };

      let result = await this.lessonService.create(createData);

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
  async update(@Param('id') id: string, @Body() updateDto: UpdateLessonDto): Promise<object> {
    try {
      const data = await updateDto;

      let result = await this.lessonService.update(id, data);

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
      const data = await this.lessonService.findOne({id});

      let from = 0;
      let to = 0;

      const lastData: any = await this.lessonService.getOneOrder(data.playlist_id, 'DESC');
      from = data.sort_order;
      to = lastData[0].sort_order;
      await this.lessonService.replaceOrderBetween(data.playlist_id, 'minus', from, to);

      let result = await this.lessonService.delete(id);

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
      const data = await this.lessonService.findOneWithTrash({id});
      const lastSort = await this.lessonService.getOneOrder(data.playlist_id, 'DESC');
      let restore: any = await this.lessonService.restore(id);
      restore = {
        ...restore,
        sort_order : lastSort[0].sort_order + 1,
      };
      let result = await this.lessonService.update(id, restore);

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
      let result = await this.lessonService.forceDelete(id);

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
  async changeOrder(@Param('id') id: string, @Body() changeLessonOrder: ChangeLessonOrder): Promise<object> {
    try {
      const data: any = await changeLessonOrder;
      const findData = await this.lessonService.findOne({
        id,
      });

      let from = findData.sort_order; let to = data.sort_order; let operator = 'minus';
      if (data.sort_order < findData.sort_order) {
        from = data.sort_order; to = findData.sort_order; operator = 'plus';
      }
      const dataSet = await this.lessonService.findBetween(from, to, findData.playlist_id);
      for (const dtSet of dataSet) {
        const changeTo = {
          id: dtSet.id,
          sort_order: operator === 'minus' ? dtSet.sort_order - 1 : dtSet.sort_order + 1,
        };

        if (id === dtSet.id) { changeTo.sort_order = data.sort_order; }
        await this.lessonService.changeOrder(changeTo);
      }

      let result = await this.lessonService.findBetween(from, to, findData.playlist_id);
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

  async generateSlug(createDto: CreateLessonDto): Promise<string> {
    try {
      let slug = createDto.slug;
      const title = createDto.title;
      // if slug is not set, generate slug
      if (!slug) {
        slug = slugify(title);
      }

      // if slug is set, check slug is exist or not
      const findOneSlugExist = await this.lessonService.findOneWithTrash({slug});
      if (findOneSlugExist) {
        const query = {
          like: {
            slug,
          },
        };
        const findAllSlugExist = await this.lessonService.findAll(query); // find also in trash

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
