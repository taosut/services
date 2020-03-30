import { DefaultRoles, Roles } from '@agora-edu/auth';
import { ExceptionHandler } from '@magishift/util';
import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiUseTags,
} from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { KeycloakGuard } from '../guards/keycloak.guard';
import { KeycloakConfig } from './keycloakConfig.entity';
import { KeycloakConfigService } from './keycloakConfig.service';
import { RealmConfigClient } from './types/realmClientConfig.type';

@Crud({
  model: {
    type: KeycloakConfig,
  },
  params: {
    id: {
      field: 'id',
      type: 'string',
      primary: true,
    },
  },
})
@ApiUseTags()
@Controller()
@ApiBearerAuth()
@UseGuards(KeycloakGuard)
@Roles(DefaultRoles.admin)
export class KeycloakConfigController {
  constructor(protected readonly service: KeycloakConfigService) {}

  @ApiOperation({ title: 'Fetch single realm config by realm name' })
  @ApiResponse({ status: 200, type: RealmConfigClient })
  @Get('realm/:realm')
  @Roles(DefaultRoles.public)
  async getRealmConfig(
    @Param('realm') realm: string
  ): Promise<RealmConfigClient> {
    try {
      return await this.service.getConfigByName(realm);
    } catch (e) {
      return ExceptionHandler(e);
    }
  }

  @ApiOperation({ title: 'Delete existing realm config by realm name' })
  @Delete('realm/:realm')
  @Roles(DefaultRoles.admin)
  async deleteRealmConfig(@Param('realm') realm: string): Promise<boolean> {
    try {
      return await this.service.deleteConfigByName(realm);
    } catch (e) {
      return ExceptionHandler(e);
    }
  }
}
