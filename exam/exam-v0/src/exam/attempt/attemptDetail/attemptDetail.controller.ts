import {
  Controller,
} from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { AttemptDetail } from './attemptDetail.entity';
import { AttemptDetailService } from './attemptDetail.service';

@Crud({
  model: {
    type: AttemptDetail,
  },
  params: {
    attemptId: {
      field: 'attempt_id',
      type: 'string',
    },
    id: {
      field: 'id',
      type: 'string',
      primary: true,
    },
  },
  query: {
    join: {
      attempt: {
        exclude: [],
      },
    },
  },
})
@ApiUseTags('AttemptDetail')
@Controller('attempt/:attemptId/detail')
export class AttemptDetailController {
  constructor(public service: AttemptDetailService) {}
}
