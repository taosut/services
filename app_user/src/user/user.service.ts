import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dotenv = require('dotenv');
import _ = require('lodash');
import { DeleteResult, Repository } from 'typeorm';
import { AccountService } from './account.service';
import { IUser } from './interfaces/user.interface';
import { IUserCreatePayload } from './interfaces/userCreatePayload.interface';
import { IUserUpdatePayload } from './interfaces/userUpdatePayload.interface';
import { User } from './user.entity';

const { parsed } = dotenv.config({
  path: process.cwd() + '/.env',
});

process.env = { ...parsed, ...process.env };

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    protected readonly repository: Repository<User>,
    protected readonly accountService: AccountService
  ) {}

  async create(user: IUserCreatePayload): Promise<IUser> {
    if (_.isEmpty(user)) {
      throw new Error('Cannot create Empty data');
    }

    const newAccount = (await this.accountService.create(user)) as any;

    const newUser = (user as any) as IUser;
    newUser.createdAt = new Date();
    newUser.keycloakId = newAccount.data.id;
    const entity = await this.repository.create(newUser);

    const result = await this.repository.save(entity);
    return result;
  }

  async update(id: string, data: IUserUpdatePayload): Promise<IUser> {
    const found = await this.repository.findOne({ id });
    if (!found) {
      throw new HttpException('User Id not registered', 404);
    }

    const user = (data as any) as IUser;
    user.updatedAt = new Date();

    const update = await this.repository.update(id, user);
    if (!update) {
      throw new HttpException('Error Updating User Data', 400);
    }

    const result = await this.fetch(id);

    return result;
  }

  async fetch(id: string): Promise<IUser> {
    const result = await this.repository.findOne({ id });

    if (!result) {
      throw new HttpException(`Not Found`, 404);
    }

    return result;
  }

  async findAll(): Promise<IUser[]> {
    const result = await this.repository
      .createQueryBuilder()
      .where('isDeleted = FALSE')
      .orderBy('createdAt', 'ASC')
      .limit(10)
      .getMany();

    return result;
  }

  async delete(id: string): Promise<IUser> {
    const found = await this.repository.findOne({ id });
    if (!found) {
      throw new HttpException('User Id not registered', 404);
    }

    const update = await this.repository.update(id, { isDeleted: true });

    if (!update) {
      throw new HttpException('Error Updating User Data', 400);
    }

    const result = await this.fetch(id);

    return result;
  }

  async forceDelete(id: string): Promise<DeleteResult> {
    const found = await this.repository.findOne({ id });
    if (!found) {
      throw new HttpException('User Id not registered', 404);
    }

    await this.accountService.delete(found.keycloakId);

    return await this.repository.delete(id);
  }
}
