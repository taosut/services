import { HttpException, Injectable } from '@nestjs/common';
import _ from 'lodash';
import { Account, AccountUpdate } from '../account/types/account.type';
import { AccountCredential } from '../account/types/accountCredential.type';
import { ERoles } from '../roles/types/role.enum';
import Role, {
  RoleMappingPayload
} from '../roles/types/roleRepresentation.type';
import { ThrowKeycloakHttpError } from '../utils/keycloak.exception';
import { KeycloakAdminService } from './keycloakAdmin.service';

@Injectable()
export class KeycloakAccountService {
  constructor(
    private readonly realm: string,
    private readonly keycloakAdminService: KeycloakAdminService
  ) {}

  async getAccountById(id: string): Promise<Account> {
    const client = await this.keycloakAdminService.adminClient();

    try {
      const account = await client.users.findOne({
        id,
        realm: this.realm,
      });

      if (!account) {
        throw new HttpException('Account not found', 404);
      }

      return account;
    } catch (e) {
      throw ThrowKeycloakHttpError(e);
    }
  }

  async getAccountByUsernameAndEmail(
    username: string,
    email: string
  ): Promise<Account> {
    const client = await this.keycloakAdminService.adminClient();

    try {
      const result = await client.users.find({
        username,
        email,
        max: 1,
        realm: this.realm,
      });

      if (
        result.length === 0 ||
        result[0].username.toLowerCase() !== username.toLowerCase()
      ) {
        throw new HttpException(
          `Cannot find account with username ${username} or email ${email}`,
          404
        );
      }

      return this.getAccountById(result[0].id);
    } catch (e) {
      throw ThrowKeycloakHttpError(e);
    }
  }

  async getAccountByUsername(username: string): Promise<Account> {
    const client = await this.keycloakAdminService.adminClient();

    try {
      const result = await client.users.find({
        username,
        max: 1,
        realm: this.realm,
      });

      if (
        result.length === 0 ||
        result[0].username.toLowerCase() !== username.toLowerCase()
      ) {
        throw new HttpException(
          'Cannot find account with username:' + username,
          404
        );
      }

      return this.getAccountById(result[0].id);
    } catch (e) {
      throw ThrowKeycloakHttpError(e);
    }
  }

  async getAccountByEmail(email: string): Promise<Account> {
    const client = await this.keycloakAdminService.adminClient();

    try {
      const result = await client.users.find({
        email,
        max: 1,
        realm: this.realm,
      });

      if (
        result.length === 0 ||
        result[0].email.toLowerCase() !== email.toLowerCase()
      ) {
        throw new HttpException('Cannot find account with email:' + email, 404);
      }

      return this.getAccountById(result[0].id);
    } catch (e) {
      throw ThrowKeycloakHttpError(e);
    }
  }

  async getAccountRoles(id: string): Promise<Role[]> {
    const client = await this.keycloakAdminService.adminClient();

    try {
      const result = await client.users.listRealmRoleMappings({
        id,
        realm: this.realm,
      });

      return result as Role[];
    } catch (e) {
      throw ThrowKeycloakHttpError(e);
    }
  }

  async searchAccounts(search?: string, max?: number): Promise<Account[]> {
    const client = await this.keycloakAdminService.adminClient();

    try {
      const results = await client.users.find({
        realm: this.realm,
        max: max || 100,
        search,
      });

      return results;
    } catch (e) {
      throw ThrowKeycloakHttpError(e);
    }
  }

  async createAccount(
    user: Account
  ): Promise<{
    id: string;
  }> {
    const client = await this.keycloakAdminService.adminClient();

    try {
      const result = await client.users.create({ ...user, realm: this.realm });

      return result;
    } catch (e) {
      throw ThrowKeycloakHttpError(e);
    }
  }

  async updateAccount(
    id: string,
    updatedAccount: AccountUpdate
  ): Promise<void> {
    const client = await this.keycloakAdminService.adminClient();

    try {
      await client.users.update(
        { id, realm: this.realm },
        { ...updatedAccount }
      );
    } catch (e) {
      throw ThrowKeycloakHttpError(e);
    }
  }

  async updateAccountCredential(
    id: string,
    credential: AccountCredential
  ): Promise<void> {
    const client = await this.keycloakAdminService.adminClient();

    try {
      await client.users.resetPassword({ id, realm: this.realm, credential });
    } catch (e) {
      throw ThrowKeycloakHttpError(e);
    }
  }

  async addAccountRoles(id: string, roles: ERoles[]): Promise<void> {
    const client = await this.keycloakAdminService.adminClient();

    try {
      const resolvedRole: RoleMappingPayload[] = await Promise.all(
        roles.map(async name => {
          const roleFind = (await client.roles.findOneByName({
            name,
            realm: this.realm,
          })) as RoleMappingPayload;

          if (!roleFind) {
            throw new HttpException(`Unsupported role "${name}"`, 400);
          }

          return roleFind;
        })
      );

      await client.users.addRealmRoleMappings({
        id,
        roles: resolvedRole,
        realm: this.realm,
      });
    } catch (e) {
      throw ThrowKeycloakHttpError(e);
    }
  }

  async deleteAccountRoles(id: string, roles: ERoles[]): Promise<void> {
    const client = await this.keycloakAdminService.adminClient();

    try {
      const resolvedRole: RoleMappingPayload[] = await Promise.all(
        roles.map(async name => {
          const roleFind = (await client.roles.findOneByName({
            name,
            realm: this.realm,
          })) as RoleMappingPayload;

          if (!roleFind) {
            throw new HttpException(`Unsupported role "${name}"`, 400);
          }

          return roleFind;
        })
      );

      await client.users.delRealmRoleMappings({
        id,
        roles: resolvedRole,
        realm: this.realm,
      });
    } catch (e) {
      throw ThrowKeycloakHttpError(e);
    }
  }

  async disableAccountById(id: string): Promise<void> {
    const client = await this.keycloakAdminService.adminClient();

    try {
      await client.users.update({ id, realm: this.realm }, { enabled: false });
    } catch (e) {
      throw ThrowKeycloakHttpError(e);
    }
  }

  async disableAccountByUsername(username: string): Promise<void> {
    const client = await this.keycloakAdminService.adminClient();

    try {
      const account = await this.getAccountByUsername(username);

      await client.users.update(
        { id: account.id, realm: this.realm },
        { enabled: false }
      );
    } catch (e) {
      throw ThrowKeycloakHttpError(e);
    }
  }

  async deleteAccountById(id: string): Promise<void> {
    const client = await this.keycloakAdminService.adminClient();

    try {
      await client.users.del({ id, realm: this.realm });
    } catch (e) {
      throw ThrowKeycloakHttpError(e);
    }
  }

  async deleteAccountByUsername(username: string): Promise<void> {
    const client = await this.keycloakAdminService.adminClient();

    try {
      const account = await this.getAccountByUsername(username);

      await client.users.del({ id: account.id, realm: this.realm });
    } catch (e) {
      throw ThrowKeycloakHttpError(e);
    }
  }

  async validateRedirectUri(
    redirectUri: string,
    clientId: string
  ): Promise<boolean> {
    const client = await this.keycloakAdminService.adminClient();

    try {
      const clientObj = await client.clients.find({
        clientId,
        realm: this.realm,
      });

      if (clientObj.length === 0) {
        throw new HttpException(
          `Client ${clientId} in realm ${this.realm} not found`,
          404
        );
      }

      if (clientObj[0].redirectUris.length > 0) {
        return (
          _.find(clientObj[0].redirectUris, (val: string) => {
            return new RegExp(val).test(redirectUri);
          }).length > 0
        );
      }

      return false;
    } catch (e) {
      throw ThrowKeycloakHttpError(e);
    }
  }
}
