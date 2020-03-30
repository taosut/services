import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './types/channel.dto';
import { QueryParse } from './types/crudjsx.query';

@ApiUseTags('Channel')
@Controller('/')
export class BaseController {
  constructor(public service: ChannelService) {}

  @ApiOperation({
    title: 'Retrieve classes of channel',
  })
  @Get('/channel/classes')
  async getClasses(
    @Query('slug') slug: string,
    @Query() query: QueryParse
  ): Promise<any> {
    const channel = await this.service.getOneBySlug(slug);
    if (!channel) {
      throw new HttpException(
        `Channel with slug ${slug} Not Found`,
        HttpStatus.NOT_FOUND
      );
    }
    return await this.service.getClasses(channel.id, query);
  }

  @ApiOperation({
    title: 'Register channel',
  })
  @Post('/register')
  async registerChannel(
    @Headers('authorization') authorization: string,
    @Headers('realm') realm: string,
    @Body() dto: CreateChannelDto
  ): Promise<any> {
    return await this.service.registerChannel({ authorization, realm }, dto);
  }
}
