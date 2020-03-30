import {
  Controller,
  Get,
  Headers,
  HttpException,
  Param,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedRequest,
} from '@nestjsx/crud';
import _ from 'lodash';
import { MembershipsInvokeService } from '../../services/invokes/membership.service';
import { getUserId } from '../../services/utils/auth';
import { UnitDto } from '../unit/types/unit.dto';
import { Class } from './class.entity';
import { ClassService } from './class.service';
import { ClassDto, FindByMetaDto, MyClassDto } from './types/class.dto';
import { ClassResponse } from './types/classResponse';
import { QueryDto } from './types/query.dto';

@Crud({
  model: {
    type: Class,
  },
  params: {
    id: {
      field: 'id',
      type: 'string',
      primary: true,
    },
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
  routes: {
    exclude: [
      'createManyBase',
      'deleteOneBase',
      'createOneBase',
      'replaceOneBase',
      'updateOneBase',
      'getManyBase',
    ],
  },
})
@ApiUseTags('[Learner] Class')
@Controller('learner/class')
export class LearnerClassController implements CrudController<Class> {
  private userId: string;
  constructor(
    public service: ClassService,
    protected membershipsInvokeService: MembershipsInvokeService
  ) {}

  get base(): CrudController<Class> {
    return this;
  }

  @ApiOperation({ title: 'Retrieve classes by meta' })
  @Get('fetch/byMeta')
  async findClass(@Query() query: FindByMetaDto): Promise<ClassResponse[]> {
    try {
      const classEntity = await this.service.findClass(query);

      const classes: ClassResponse[] = classEntity as ClassResponse[];

      if (classes.length) {
        for (const [index] of classes.entries()) {
          classes[index] = await this.service.resolveContent(classes[index]);
          classes[index] = await this.service.resolveTracks(classes[index]);

          if (classes[index].tracks) {
            for (const [i] of classes[index].tracks.entries()) {
              for (const [j] of classes[index].tracks[i].units.entries()) {
                const unit = classes[index].tracks[i].units[j] as UnitDto;
                delete unit.content_id;
                delete unit.content;
                delete unit.content_ids;
                delete unit.ebooks;
                delete unit.audio_tracks;

                classes[index].tracks[i].units[j] = unit;
              }
            }
          }
        }
      }

      return classes;
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }

  @ApiOperation({ title: 'Retrieve my classes' })
  @Get('myClass/:userId')
  async getMyClass(
    @Param('userId') userId: string,
    @Query() query?: QueryDto
  ): Promise<MyClassDto[]> {
    const response = await this.membershipsInvokeService.findMyClass(
      userId,
      query
    );

    const myClasses: MyClassDto[] =
      response && response.data ? response.data : response;

    if (response && response.data && myClasses) {
      response.data = await this.service.resolveMyClasses(myClasses, query);
      return response;
    }
    if (myClasses) {
      return await this.service.resolveMyClasses(myClasses, query);
    }

    return response;
  }

  @Override('getOneBase')
  async findOne(
    @ParsedRequest() req: CrudRequest,
    @Headers('authorization') authorization: string
  ): Promise<ClassDto> {
    this.userId = getUserId(authorization);

    if (!this.userId) {
      throw new HttpException('Unauthorized', 401);
    }

    const id = _.find(req.parsed.paramsFilter, obj => {
      return obj.field === 'id';
    }).value;

    const isMembershipExist = await this.membershipsInvokeService.find(
      this.userId,
      id
    );

    const isJoinedMembership =
      !isMembershipExist ||
      (isMembershipExist &&
        isMembershipExist.length &&
        isMembershipExist[0].has_joined);

    if (!isJoinedMembership) {
      throw new HttpException(`user hasn't joined this class yet `, 401);
    }

    const response = await this.base.getOneBase(req);
    return response;
  }
}
