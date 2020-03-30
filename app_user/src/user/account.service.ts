import { HttpException, Injectable } from '@nestjs/common';
import axios from 'axios';
import dotenv = require('dotenv');
import { IUserCreatePayload } from './interfaces/userCreatePayload.interface';

const { parsed } = dotenv.config({
  path: process.cwd() + '/.env',
});

process.env = { ...parsed, ...process.env };

const keycloakUrl = process.env.KEYCLOAK_URL;
const realm = process.env.KEYCLOAK_ZENCORE_REALM;

@Injectable()
export class AccountService {
  async create(user: IUserCreatePayload): Promise<object> {
    const result = await axios({
      method: 'post',
      url: `${keycloakUrl}/accounts/${realm}`,
      data: {
        username: user.username,
        credentials: [
          {
            type: 'password',
            value: user.password,
          },
        ],
        email: user.email,
        firstName: user.fullName || '',
        lastName: '',
      },
    });

    if (result.status !== 201) {
      throw new HttpException(result.statusText, result.status);
    }
    return result;
  }

  async delete(keycloakId: string): Promise<any> {
    const deleteAccount = await axios({
      method: 'delete',
      url: `${keycloakUrl}/accounts/${realm}/${keycloakId}`,
    });

    if (deleteAccount.status !== 200) {
      throw new HttpException(deleteAccount.statusText, deleteAccount.status);
    }

    return deleteAccount;
  }
}
