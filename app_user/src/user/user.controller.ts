import { ExceptionHandler } from '@magishift/util/dist';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';
import { IUser } from './interfaces/user.interface';
import { IUserCreatePayload } from './interfaces/userCreatePayload.interface';
import { IUserUpdatePayload } from './interfaces/userUpdatePayload.interface';
import { UserService } from './user.service';

@Controller('user')
@ApiUseTags()
export class UserController {
  constructor(private readonly service: UserService) {}
  @Get()
  async findAllUser(): Promise<IUser[]> {
    try {
      const result = await this.service.findAll();
      return result;
    } catch (e) {
      return ExceptionHandler(e);
    }
  }

  @Post()
  async createUser(@Body() user: IUserCreatePayload): Promise<IUser> {
    try {
      const result = await this.service.create(user);
      return result;
    } catch (e) {
      return ExceptionHandler(e);
    }
  }

  @Patch('delete/:id')
  async delete(@Param('id') id: string): Promise<IUser> {
    return await this.service.delete(id);
  }

  @Delete(':id')
  async forceDelete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.service.forceDelete(id);
  }

  @Get(':id')
  async fetchUser(@Param('id') id: string): Promise<IUser> {
    try {
      const result = await this.service.fetch(id);
      return result;
    } catch (e) {
      return ExceptionHandler(e);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() entry: IUserUpdatePayload
  ): Promise<IUser> {
    return await this.service.update(id, entry);
  }
}
