import { HttpException, Injectable } from '@nestjs/common';
import RealmRepresentation from 'keycloak-admin/lib/defs/realmRepresentation';
import _ from 'lodash';
import { ThrowKeycloakHttpError } from '../utils/keycloak.exception';
import { KeycloakAdminService } from './keycloakAdmin.service';

@Injectable()
export class KeycloakRealmService {
  constructor(private readonly keycloakAdminService: KeycloakAdminService) {}

  async createRealm(
    realm: RealmRepresentation
  ): Promise<{ realmName: string }> {
    const client = await this.keycloakAdminService.adminClient();

    try {
      const result = await client.realms.create(realm);
      return result;
    } catch (e) {
      throw ThrowKeycloakHttpError(e);
    }
  }

  async getAllRealms(): Promise<RealmRepresentation[]> {
    const client = await this.keycloakAdminService.adminClient();

    try {
      const result = await client.realms.find();
      return result;
    } catch (e) {
      throw ThrowKeycloakHttpError(e);
    }
  }

  async getRealmByName(realm: string): Promise<RealmRepresentation> {
    const client = await this.keycloakAdminService.adminClient();

    try {
      const result = await client.realms.findOne({ realm });
      if (!result) {
        throw new HttpException(`Realm ${realm} not found`, 404);
      }
      return result;
    } catch (e) {
      throw ThrowKeycloakHttpError(e);
    }
  }
}
