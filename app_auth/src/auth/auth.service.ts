import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { stringify } from 'query-string';
import * as querystring from 'querystring';
import urlJoin from 'url-join';
import { decodeAccessToken } from '../utils/decodeAccessToken';
import { keycloakThrowHttpError } from '../utils/keycloak.exception';
import { ITokenResponse } from './types/tokenResponse.type';

@Injectable()
export class AuthService {
  private defaultAuthServerUrl: string;

  constructor() {
    this.defaultAuthServerUrl = urlJoin(
      `${process.env.KEYCLOAK_BASE_URL}`,
      'auth'
    );
  }

  async getUserSessions(accessToken: string, realm: string): Promise<any[]> {
    try {
      const decodedToken = decodeAccessToken(accessToken);

      const { data } = await axios.get(
        `${this.defaultAuthServerUrl}/admin/realms/${realm}/users/${decodedToken.sub}/sessions`,
        {
          headers: {
            Authorization: accessToken,
          },
        }
      );

      return data;
    } catch (e) {
      keycloakThrowHttpError(e);
    }
  }

  async login(
    username: string,
    password: string,
    realm: string
  ): Promise<ITokenResponse> {
    try {
      const url = `${this.defaultAuthServerUrl}/realms/${realm}/protocol/openid-connect/token`;

      // Prepare credentials for openid-connect token request
      // ref: http://openid.net/specs/openid-connect-core-1_0.html#TokenEndpoint
      const payload = querystring.stringify({
        username,
        password,
        grant_type: 'password',
        client_id: process.env.KEYCLOAK_APP_CLIENT,
      });

      const { data } = await axios.post(url, payload);

      return data;
    } catch (e) {
      keycloakThrowHttpError(e);
    }
  }

  async logout(authorization: string, realm: string): Promise<void> {
    const url = `${this.defaultAuthServerUrl}/realms/${realm}/protocol/openid-connect/logout?redirect_uri=${this.defaultAuthServerUrl}`;

    try {
      await axios.get(url, {
        headers: {
          Authorization: authorization,
        },
      });
    } catch (e) {
      keycloakThrowHttpError(e);
    }
  }

  async refreshToken(
    refreshToken: string,
    realm: string
  ): Promise<ITokenResponse> {
    const url = `${this.defaultAuthServerUrl}/realms/${realm}/protocol/openid-connect/token`;

    try {
      const { data } = await axios.post(
        url,
        stringify({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: process.env.KEYCLOAK_APP_CLIENT,
        }),
        {
          headers: {
            'Content-type': 'application/x-www-form-urlencoded',
          },
        }
      );

      return data;
    } catch (e) {
      keycloakThrowHttpError(e);
    }
  }

  async verifyToken(accessToken: string, realm: string): Promise<any> {
    decodeAccessToken(accessToken);

    const url = `${this.defaultAuthServerUrl}/realms/${realm}/protocol/openid-connect/userinfo`;

    return await axios.get(url, {
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
    });
  }
}
