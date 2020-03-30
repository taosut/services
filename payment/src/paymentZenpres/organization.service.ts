import { HttpException, Injectable } from '@nestjs/common';
import axios from 'axios';
import dotenv = require('dotenv');

const { parsed } = dotenv.config({
  path: process.cwd() + '/.env',
});

process.env = { ...parsed, ...process.env };

const organizationUrl = process.env.ORGANIZATION_URL;

@Injectable()
export class OrganizationService {
  async findById(id: string): Promise<object> {
    const result = await axios({
      method: 'get',
      url: `${organizationUrl}/organization/${id}`,
    });

    if (result.status !== 200) {
      throw new HttpException(result.statusText, result.status);
    }
    return result.data;
  }
}
