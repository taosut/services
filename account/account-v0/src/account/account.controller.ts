import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Put,
  Query
} from '@nestjs/common';
import { ApiBearerAuth, ApiImplicitQuery, ApiOperation } from '@nestjs/swagger';
import { KeycloakAccountService } from '../keycloak/keycloakAccount.service';
import Role, { RolePayload } from '../roles/types/roleRepresentation.type';
import { Account, AccountUpdate } from './types/account.type';
import { AccountCredential } from './types/accountCredential.type';

@Controller('accounts')
@ApiBearerAuth()
export class AccountController {
  constructor(protected readonly service: KeycloakAccountService) {}

  @ApiOperation({ title: 'Filter all accounts' })
  @ApiImplicitQuery({ name: 'max', type: Number, required: false })
  @ApiImplicitQuery({ name: 'search', type: String, required: false })
  @Get('/')
  async searchAccounts(
    @Query('search') search: string,
    @Query('max') max: number
  ): Promise<Account[]> {
    const result = await this.service.searchAccounts(search, max);

    return result;
  }

  @ApiOperation({ title: 'Get account by username or email' })
  @ApiImplicitQuery({ name: 'username', type: String, required: false })
  @ApiImplicitQuery({ name: 'email', type: String, required: false })
  @Get('/find')
  async getAccountByUsername(
    @Query('username') username: string,
    @Query('email') email: string
  ): Promise<Account> {
    if (username && email) {
      return await this.service.getAccountByUsernameAndEmail(username, email);
    } else if (username) {
      return await this.service.getAccountByUsername(username);
    } else if (email) {
      return await this.service.getAccountByEmail(email);
    }

    throw new HttpException('Please define username or email', 400);
  }

  @ApiOperation({ title: 'Get account by id' })
  @Get(':id')
  async getAccountById(@Param('id') id: string): Promise<Account> {
    return await this.service.getAccountById(id);
  }

  @ApiOperation({ title: 'Get account roles' })
  @Get('/roles/:id')
  async getAccountRoles(@Param('id') id: string): Promise<Role[]> {
    return await this.service.getAccountRoles(id);
  }

  @ApiOperation({ title: 'Create new account' })
  @Post()
  async createAccount(@Body() account: Account): Promise<{ id: string }> {
    return await this.service.createAccount(account);
  }

  @ApiOperation({ title: 'Update existing account' })
  @Patch(':id')
  async updateAccount(
    @Param('id') id: string,
    @Body() account: AccountUpdate
  ): Promise<void> {
    return await this.service.updateAccount(id, account);
  }

  @ApiOperation({ title: 'Change account credential' })
  @Patch('/changeCredential/:id')
  async changePassword(
    @Param('id') id: string,
    @Body() credential: AccountCredential
  ): Promise<void> {
    return await this.service.updateAccountCredential(id, credential);
  }

  @ApiOperation({
    title: 'Delete existing account by id',
  })
  @Delete(':id')
  async deleteAccountById(@Param('id') id: string): Promise<void> {
    return await this.service.deleteAccountById(id);
  }

  @ApiOperation({ title: 'Disable account by id' })
  @Patch('/disable/:id')
  async disableAccountById(@Param('id') id: string): Promise<void> {
    return await this.service.disableAccountById(id);
  }

  @ApiOperation({
    title: 'Delete existing account by username',
  })
  @Delete('/username/:username')
  async deleteAccountByUsername(
    @Param('username') username: string
  ): Promise<void> {
    return await this.service.deleteAccountByUsername(username);
  }

  @ApiOperation({ title: 'Disable account by username' })
  @Patch('/disable/username/:username')
  async disableAccountByUsername(
    @Param('username') username: string
  ): Promise<void> {
    return await this.service.disableAccountByUsername(username);
  }

  @Put('/roles/:id/')
  @ApiOperation({ title: 'Add account roles' })
  async addAccountRoles(
    @Param('id') id: string,
    @Body() payload?: RolePayload
  ): Promise<void> {
    if (Array.isArray(payload.roles) && payload.roles.length > 0) {
      return await this.service.addAccountRoles(id, payload.roles);
    } else {
      throw new HttpException('Invalid Roles Data', 400);
    }
  }

  @Delete('/roles/:id/')
  @ApiOperation({ title: 'Add account roles' })
  async deleteAccountRoles(
    @Param('id') id: string,
    @Body() payload?: RolePayload
  ): Promise<void> {
    if (Array.isArray(payload.roles) && payload.roles.length > 0) {
      return await this.service.deleteAccountRoles(id, payload.roles);
    } else {
      throw new HttpException('Invalid Roles Data', 400);
    }
  }
}
