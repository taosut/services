import { Controller, Delete, Get, HttpException, Param } from '@nestjs/common';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import {
  Crud,
  CrudController,
  CrudRequest,
  GetManyDefaultResponse,
  Override,
  ParsedRequest,
} from '@nestjsx/crud';
import _ from 'lodash';
import { Class } from './class.entity';
import { ClassService } from './class.service';
import { ClassInfoDto } from './types/classInfo.dto';
import { ClassResponse } from './types/classResponse';

@Crud({
  model: {
    type: Class,
  },
  query: {
    join: {
      // tslint:disable-next-line:quotemark
      "tracks": { eager: true },
      'tracks.units': {
        eager: true,
        exclude: ['exam_id', 'content_id', 'content_ids'],
      },
    },
  },
  params: {
    id: {
      field: 'id',
      type: 'string',
      primary: true,
    },
  },
  routes: { exclude: ['createManyBase'] },
})
@ApiUseTags('Class')
@Controller('class')
export class ClassController implements CrudController<Class> {
  constructor(public service: ClassService) {}

  get base(): CrudController<Class> {
    return this;
  }

  @ApiOperation({
    title: 'Retrieve class info',
  })
  @Get('/:id/info')
  async getClassInfo(@Param('id') id: string): Promise<ClassInfoDto> {
    return await this.service.resolveClassInfo(id);
  }

  @Override()
  async getMany(
    @ParsedRequest() req: CrudRequest
  ): Promise<GetManyDefaultResponse<ClassResponse> | ClassResponse[]> {
    try {
      const classEntity = await this.base.getManyBase(req);

      const response = classEntity as GetManyDefaultResponse<ClassResponse>;

      if (response.data) {
        for (const [i] of response.data.entries()) {
          response.data[i] = await this.service.resolveContent(
            response.data[i]
          );
        }

        return response;
      }

      const classes: ClassResponse[] = classEntity as ClassResponse[];

      if (classes.length) {
        for (const [i] of classes.entries()) {
          classes[i] = await this.service.resolveContent(classes[i]);
        }
      }

      return classes;
    } catch (error) {
      throw new HttpException(error.message, error.statusCode);
    }
  }

  @Delete('/:id')
  async delete(@Param('id') id: string): Promise<void> {
    await this.service.delete(id);
  }

  @Get('/:slug/detail')
  async classBySlug(@Param('slug') slug: string): Promise<ClassResponse> {
    return await this.service.classBySlug(slug);
  }
}
