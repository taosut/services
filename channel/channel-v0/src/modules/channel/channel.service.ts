import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { ClassInvokeService } from '../../services/invokes/class.service';
import { AccountService } from './account/account.service';
import {
  CreateAccountDto,
  CreateChannelAccountDto,
} from './account/types/account.dto';
import { Channel } from './channel.entity';
import { CreateChannelDto } from './types/channel.dto';
import { QueryParse } from './types/crudjsx.query';

@Injectable()
export class ChannelService extends TypeOrmCrudService<Channel> {
  constructor(
    @InjectRepository(Channel)
    private readonly repository: Repository<Channel>,
    protected readonly accountService: AccountService,
    protected readonly classInvokeService: ClassInvokeService
  ) {
    super(repository);
  }

  async getOneBySlug(slug: string): Promise<Channel> {
    return await this.repository.findOne({ slug });
  }

  async getClasses(id: string, query: QueryParse): Promise<any> {
    const classes = await this.classInvokeService.findByChannel(
      id,
      query.page,
      query.per_page
    );

    return classes;
  }

  async registerChannel(
    dataHeader: any,
    dto: CreateChannelDto
  ): Promise<Channel> {
    const channelDto = {
      name: dto.name,
      description: dto.description,
      short_description: dto.sort_description,
      meta: dto.meta,
    };

    const entry = await this.repository.create(channelDto);
    const entity = await this.repository.save(entry);

    const data: CreateAccountDto = {
      username: dto.username,
      email: dto.email,
      enabled: true,
      emailVerified: false,
      credentials: [
        {
          type: 'password',
          value: dto.password,
        },
      ],
      firstName: dto.name,
      lastName: '',
    };

    const accountKeycloak = await this.accountService.registerAccount(
      dataHeader,
      data
    );

    const channelAccountDto: CreateChannelAccountDto = {
      channel_id: entity.id,
      account_id: accountKeycloak.id,
    };

    let channelAccount;
    try {
      channelAccount = await this.accountService.createChannelAccount(
        channelAccountDto
      );
    } catch (error) {
      await this.repository.delete({ id: entity.id });
      throw new HttpException(error.message, 500);
    }

    const response = entity;
    response.accounts = [channelAccount];
    return response;
  }
}
