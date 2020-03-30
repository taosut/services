import { HttpStatus } from '@nestjs/common';
import { HttpException, Injectable } from '@nestjs/common';
import KeycloakAdminClient from 'keycloak-admin';
import _ from 'lodash';

@Injectable()
export class KeycloakAdminService {
  private keycloakClient: KeycloakAdminClient;

  constructor(private clientRealm: string) {
    try {
      if (this.clientRealm === 'agora') {
        this.keycloakClient = new KeycloakAdminClient({
          baseUrl: `${process.env.KEYCLOAK_BASE_URL}/auth`,
          realmName: process.env.KEYCLOAK_REALM_MAIN,
        });
      } else {
        this.keycloakClient = new KeycloakAdminClient({
          baseUrl: `${process.env.KEYCLOAK_BASE_URL_SAAS}/auth`,
          realmName: process.env.KEYCLOAK_REALM_MAIN_SAAS,
        });
      }
    } catch (e) {
      throw new HttpException(`Error initialize keycloak service`, 500);
    }
  }

  async adminClient(): Promise<KeycloakAdminClient> {
    try {
      if (this.clientRealm === 'agora') {
        await this.keycloakClient.auth({
          username: process.env.KEYCLOAK_USER_MAIN,
          password: process.env.KEYCLOAK_PASSWORD_MAIN,
          clientId: 'admin-cli',
          grantType: 'password',
        });
      } else {
        await this.keycloakClient.auth({
          username: process.env.KEYCLOAK_USER_MAIN_SAAS,
          password: process.env.KEYCLOAK_PASSWORD_MAIN_SAAS,
          clientId: 'admin-cli',
          grantType: 'password',
        });
      }

      return this.keycloakClient;
    } catch (e) {
      throw new HttpException(
        `Cannot login to keycloak server, on realm ${
          this.keycloakClient.realmName
        } ${JSON.stringify(
          e.response && e.response.data ? e.response.data : e
        )}`,
        e.response && e.response.status
          ? e.response.status
          : HttpStatus.UNAUTHORIZED
      );
    }
  }
}
