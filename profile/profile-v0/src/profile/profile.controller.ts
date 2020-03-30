import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  Logger,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { getUserId } from '../utils/auth';
import {
  CreateManyAccountProfileDto,
  CreateProfileDto,
  FetchByAccountIdDto,
  FetchByEmailDto,
  FetchByUsernameDto,
  SearchAccountDto,
  UpdateAccountProfileDto,
} from './accountProfile.dto';
import { ProfileService } from './profile.service';

@ApiUseTags('Profile')
@Controller('profiles')
@ApiBearerAuth()
export class ProfileController {
  constructor(public service: ProfileService) {}

  @ApiOperation({ title: 'Get profile and account by account id' })
  @Get(':id')
  async getOneAndAccount(
    @Headers('authorization') authorization,
    @Headers('realm') realm: string,
    @Param('id') id: string
  ) {
    if (id === 'me') {
      const userId = getUserId(authorization);

      if (!userId) {
        throw new HttpException('Unauthorized', 401);
      }
      id = userId;
    }
    try {
      return await this.service.findOneAndAccount({ realm }, id);
    } catch (err) {
      Logger.error(err);
      if (err.statusCode || err.status) {
        throw new HttpException(
          err.message,
          err.statusCode || err.status || 500
        );
      } else {
        throw new HttpException(JSON.stringify(err), 500);
      }
    }
  }

  @ApiOperation({ title: 'Replace profile and account by account id' })
  @Put(':id')
  async replaceProfile(
    @Headers('realm') realm: string,
    @Param('id') id: string,
    @Body() dto: UpdateAccountProfileDto
  ) {
    try {
      return await this.service.updateProfile(id, dto);
    } catch (err) {
      Logger.error(err);
      if (err.statusCode || err.status) {
        throw new HttpException(
          err.message,
          err.statusCode || err.status || 500
        );
      } else {
        throw new HttpException(JSON.stringify(err), 500);
      }
    }
  }

  @ApiOperation({ title: 'Update profile and account by account id' })
  @Patch(':id')
  async updateProfile(
    @Headers('realm') realm: string,
    @Param('id') id: string,
    @Body() dto: UpdateAccountProfileDto
  ) {
    try {
      return await this.service.updateProfile(id, dto);
    } catch (err) {
      Logger.error(err);
      if (err.statusCode || err.status) {
        throw new HttpException(
          err.message,
          err.statusCode || err.status || 500
        );
      } else {
        throw new HttpException(JSON.stringify(err), 500);
      }
    }
  }

  @ApiOperation({ title: 'Get many profile and account' })
  @Get()
  async search(
    @Headers('realm') realm: string,
    @Query() query: SearchAccountDto
  ) {
    try {
      return await this.service.searchAccount({ realm }, query);
    } catch (err) {
      Logger.error(err);
      if (err.statusCode || err.status) {
        throw new HttpException(
          err.message,
          err.statusCode || err.status || 500
        );
      } else {
        throw new HttpException(JSON.stringify(err), 500);
      }
    }
  }

  @ApiOperation({ title: 'Get profile and account by account id' })
  @Get('account/fetchByAccountId')
  async fetchByAccountId(
    @Headers('realm') realm: string,
    @Query() query: FetchByAccountIdDto
  ) {
    try {
      return await this.service.fetchOneBy({ realm }, query);
    } catch (err) {
      Logger.error(err);
      if (err.statusCode || err.status) {
        throw new HttpException(
          err.message,
          err.statusCode || err.status || 500
        );
      } else {
        throw new HttpException(JSON.stringify(err), 500);
      }
    }
  }

  @ApiOperation({ title: 'Get profile and account by username' })
  @Get('account/fetchByUsername')
  async fetchByUsername(
    @Headers('realm') realm: string,
    @Query() query: FetchByUsernameDto
  ) {
    try {
      return await this.service.fetchOneBy({ realm }, query, 'username');
    } catch (err) {
      Logger.error(err);
      if (err.statusCode || err.status) {
        throw new HttpException(
          err.message,
          err.statusCode || err.status || 500
        );
      } else {
        throw new HttpException(JSON.stringify(err), 500);
      }
    }
  }

  @ApiOperation({ title: 'Get profile and account by email' })
  @Get('account/fetchByEmail')
  async fetchByEmail(
    @Headers('realm') realm: string,
    @Query() query: FetchByEmailDto
  ) {
    try {
      return await this.service.fetchOneBy({ realm }, query, 'email');
    } catch (err) {
      Logger.error(err);
      if (err.statusCode || err.status) {
        throw new HttpException(
          err.message,
          err.statusCode || err.status || 500
        );
      } else {
        throw new HttpException(JSON.stringify(err), 500);
      }
    }
  }

  @ApiOperation({ title: 'Create one profile' })
  @Post()
  async createOneAndCount(
    @Headers('realm') realm: string,
    @Body() dto: CreateProfileDto
  ) {
    try {
      return await this.service.createProfile({ realm }, dto);
    } catch (err) {
      Logger.error(err);
      if (err.statusCode || err.status) {
        throw new HttpException(
          err.message,
          err.statusCode || err.status || 500
        );
      } else {
        throw new HttpException(JSON.stringify(err), 500);
      }
    }
  }

  @ApiOperation({ title: 'Create many accounts' })
  @Post('bulk')
  async createMany(
    @Headers('realm') realm: string,
    @Body() dto: CreateManyAccountProfileDto
  ) {
    try {
      return await this.service.createManyAndAccount({ realm }, dto);
    } catch (err) {
      Logger.error(err);
      if (err.statusCode || err.status) {
        throw new HttpException(
          err.message,
          err.statusCode || err.status || 500
        );
      } else {
        throw new HttpException(JSON.stringify(err), 500);
      }
    }
  }

  // @Delete(':id')
  // async deleteByAccountId(
  //   @Headers('realm') realm: string,
  //   @Param('id') accountId: string
  // ) {
  //   try {
  //     return await this.service.destroy(realm, accountId);
  //   } catch (err) {
  //     Logger.error(err);
  //     if (err.statusCode || err.status) {
  //       throw new HttpException(
  //         err.message,
  //         err.statusCode || err.status || 500
  //       );
  //     } else {
  //       throw new HttpException(JSON.stringify(err), 500);
  //     }
  //   }
  // }

  // @Delete('username/:username')
  // async deleteByUsername(
  //   @Headers('realm') realm: string,
  //   @Param('username') username: string
  // ) {
  //   try {
  //     return await this.service.destroy(realm, username, 'username');
  //   } catch (err) {
  //     Logger.error(err);
  //     if (err.statusCode || err.status) {
  //       throw new HttpException(
  //         err.message,
  //         err.statusCode || err.status || 500
  //       );
  //     } else {
  //       throw new HttpException(JSON.stringify(err), 500);
  //     }
  //   }
  // }

  // @UseInterceptors(FileInterceptor('file'))
  // @ApiConsumes('multipart/form-data')
  // @ApiImplicitFile({
  //   name: 'file',
  //   required: true,
  // })
  // @Put(':id/photo')
  // async changePhoto(@UploadedFile() file: IFile, @Param('id') id: string) {
  //   if (file.size > 5242880) {
  //     console.info('file size > 5Mb');
  //     throw new HttpException(
  //       {
  //         message: 'File size is to large, Maximum file size is 5mb',
  //         status: HttpStatus.PAYLOAD_TOO_LARGE,
  //       },
  //       HttpStatus.PAYLOAD_TOO_LARGE
  //     );
  //   } else {
  //     console.info('file size <= 5Mb');
  //   }
  //   try {
  //     return await this.service.uploadPhoto(id, file);
  //   } catch (err) {
  //     Logger.error(err);
  //     if (err.statusCode || err.status) {
  //       throw new HttpException(
  //         err.message,
  //         err.statusCode || err.status || 500
  //       );
  //     } else {
  //       throw new HttpException(JSON.stringify(err), 500);
  //     }
  //   }
  // }
}
