import { Controller } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { Channel } from './channel.entity';
import { ChannelService } from './channel.service';

@Crud({
  model: {
    type: Channel,
  },
  params: {
    id: {
      field: 'id',
      type: 'string',
      primary: true,
    },
  },
  routes: {
    exclude: ['createManyBase', 'replaceOneBase', 'createOneBase'],
  },
})
@ApiUseTags('Channel')
@Controller('/channel')
export class ChannelController implements CrudController<Channel> {
  constructor(public service: ChannelService) {}

  get base(): CrudController<Channel> {
    return this;
  }
}
