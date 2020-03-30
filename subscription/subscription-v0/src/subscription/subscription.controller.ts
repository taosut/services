import {
  Controller, Get, HttpException, Param
} from '@nestjs/common';
import { ApiImplicitParam, ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { Subscription } from './subscription.entity';
import { SubscriptionService } from './subscription.service';

@Crud({
  model: {
    type: Subscription,
  },
  params: {
    id: {
      field: 'id',
      type: 'string',
      primary: true,
    },
  },
})
@ApiUseTags('Subscription')
@Controller('subscriptions')
export class SubscriptionController
  implements CrudController<Subscription> {
  constructor(public service: SubscriptionService) { }

  get base(): CrudController<Subscription> {
    return this;
  }
  @ApiOperation({ title: 'Check subscription by account_id' })
  @ApiImplicitParam({ name: 'account_id', type: String, required: true })
  @Get('/check/:account_id')
  async getSubscriptionByAccount(
    @Param('account_id') account_id: string
  ): Promise<Subscription> {
    try {
      return await this.service.getSubscriptionByAccount(account_id);
    } catch (err) {
      throw new HttpException(err, 400);
    }
  }
}
