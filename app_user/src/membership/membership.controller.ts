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
import { IMembership } from './interfaces/membership.interface';
import { IMembershipPayload } from './interfaces/membershipPayload.interface';
import { MembershipService } from './membership.service';

@Controller('membership')
@ApiUseTags()
export class MembershipController {
  constructor(private readonly service: MembershipService) {}
  @Get()
  async findAllMembership(): Promise<IMembership[]> {
    try {
      const result = await this.service.findAll();
      return result;
    } catch (e) {
      return ExceptionHandler(e);
    }
  }

  @Post()
  async createMembership(
    @Body() membership: IMembershipPayload
  ): Promise<IMembership> {
    try {
      const result = await this.service.create(membership);
      return result;
    } catch (e) {
      return ExceptionHandler(e);
    }
  }

  @Patch('delete/:id')
  async delete(@Param('id') id: string): Promise<IMembership> {
    return await this.service.delete(id);
  }

  @Delete(':id')
  async forceDelete(@Param('id') id: string): Promise<DeleteResult> {
    return await this.service.forceDelete(id);
  }

  @Get(':id')
  async fetchMembership(@Param('id') id: string): Promise<IMembership> {
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
    @Body() entry: IMembershipPayload
  ): Promise<IMembership> {
    return await this.service.update(id, entry);
  }
}
