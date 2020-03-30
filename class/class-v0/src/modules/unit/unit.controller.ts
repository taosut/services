import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';
import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedRequest,
} from '@nestjsx/crud';
import { UnitDto } from './types/unit.dto';
import { Unit } from './unit.entity';
import { UnitService } from './unit.service';

@Crud({
  model: {
    type: Unit,
  },
  query: {
    join: {
      track: { eager: true },
    },
  },
  params: {
    trackId: {
      field: 'track_id',
      type: 'string',
    },
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
})
@ApiUseTags('Unit')
@Controller('track/:trackId/unit')
@ApiBearerAuth()
export class UnitController implements CrudController<Unit> {
  constructor(public readonly service: UnitService) {}

  get base(): CrudController<Unit> {
    return this;
  }

  @Override('getOneBase')
  async getOne(@ParsedRequest() req: CrudRequest): Promise<Unit> {
    const unitEntity = await this.base.getOneBase(req);

    return await this.service.resolveUnit(unitEntity as UnitDto);
  }
}
