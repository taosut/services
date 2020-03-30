import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { AccountInvokeService } from '../../../../src/services/invokes/account.service';
import { Account } from './account.entity';
import { CreateAccountDto, CreateChannelAccountDto } from './types/account.dto';
import { CreateAccountResponse } from './types/account.response';

@Injectable()
export class AccountService extends TypeOrmCrudService<Account> {
  constructor(
    @InjectRepository(Account)
    protected readonly repository: Repository<Account>,
    protected readonly accountInvokeService: AccountInvokeService
  ) {
    super(repository);
  }

  async registerAccount(
    dataHeader: any,
    dto: CreateAccountDto
  ): Promise<CreateAccountResponse> {
    const response = await this.accountInvokeService.create(dataHeader, dto);

    return response;
  }

  async createChannelAccount(dto: CreateChannelAccountDto): Promise<Account> {
    const entry = await this.repository.create(dto);
    const entity = await this.repository.save(entry);

    return entity;
  }
}
