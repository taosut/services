import { Controller } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { Event } from './event.entity';
import { EventService } from './event.service';

@Crud({
  model: {
    type: Event,
  },
  query: {},
  params: {
    id: {
      field: 'id',
      type: 'string',
      primary: true,
    },
  },
})
@ApiUseTags('Event')
@Controller('event')
export class EventController implements CrudController<Event> {
  constructor(public service: EventService) {}

  get base(): CrudController<Event> {
    return this;
  }
}
