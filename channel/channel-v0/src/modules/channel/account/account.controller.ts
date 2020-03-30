import { Controller } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { Account } from './account.entity';
import { AccountService } from './account.service';
@Crud({
  model: {
    type: Account,
  },
  query: {
    join: {
      channel: { eager: true },
    },
  },
  params: {
    channelId: {
      field: 'channel_id',
      type: 'string',
    },
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  routes: { exclude: ['createManyBase', 'replaceOneBase'] },
})
@ApiUseTags('Account')
@Controller('/channel/:channelId/account')
export class AccountController implements CrudController<Account> {
  constructor(public service: AccountService) {}

  get base(): CrudController<Account> {
    return this;
  }
}
