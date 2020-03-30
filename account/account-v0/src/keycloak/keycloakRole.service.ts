import { HttpException, Injectable } from '@nestjs/common';
import _ from 'lodash';
import Role from '../roles/types/roleRepresentation.type';
import { ThrowKeycloakHttpError } from '../utils/keycloak.exception';
import { KeycloakAdminService } from './keycloakAdmin.service';

@Injectable()
export class KeycloakRoleService {
  constructor(
    private readonly realm: string,
    private readonly keycloakAdminService: KeycloakAdminService
  ) {}

  async getRoleById(id: string): Promise<Role> {
    const client = await this.keycloakAdminService.adminClient();

    try {
      return (await client.roles.findOneById({
        id,
        realm: this.realm,
      })) as Role;
    } catch (e) {
      throw ThrowKeycloakHttpError(e);
    }
  }

  async getRoleByName(name: string): Promise<Role> {
    const client = await this.keycloakAdminService.adminClient();

    try {
      const result = (await client.roles.findOneByName({
        name,
        realm: this.realm,
      })) as Role;

      if (!result) {
        throw new HttpException('Role not found', 404);
      }

      return result;
    } catch (e) {
      throw ThrowKeycloakHttpError(e);
    }
  }

  async getAllRoles(): Promise<Role[]> {
    const client = await this.keycloakAdminService.adminClient();

    try {
      const result = await client.roles.find({
        realm: this.realm,
      } as any);
      return result as Role[];
    } catch (e) {
      throw ThrowKeycloakHttpError(e);
    }
  }

  async updateRole(id: string, role: Role): Promise<void> {
    const client = await this.keycloakAdminService.adminClient();

    try {
      const result = await client.roles.updateById({ id }, role);
      return result;
    } catch (e) {
      throw ThrowKeycloakHttpError(e);
    }
  }

  async createRole(
    role: Role
  ): Promise<{
    roleName: string;
  }> {
    const client = await this.keycloakAdminService.adminClient();

    try {
      return await client.roles.create({
        ...role,
        realm: this.realm,
      });
    } catch (e) {
      throw ThrowKeycloakHttpError(e);
    }
  }

  async deleteRole(id: string): Promise<void> {
    const client = await this.keycloakAdminService.adminClient();

    try {
      await client.roles.delById({ id });
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
      const clientObj = await client.clients.find({ clientId });

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
