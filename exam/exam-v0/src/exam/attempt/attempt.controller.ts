import {
  Controller,
} from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { Attempt } from './attempt.entity';
import { AttemptService } from './attempt.service';

@Crud({
  model: {
    type: Attempt,
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
      // users: {},
      // projects: {},
    },
  },
})
@ApiUseTags('Attempt')
@Controller('attempt')
export class AttemptController {
  constructor(public service: AttemptService) {}
}
