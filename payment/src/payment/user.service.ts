import { HttpException, Injectable } from '@nestjs/common';
import axios from 'axios';
import dotenv = require('dotenv');

const { parsed } = dotenv.config({
  path: process.cwd() + '/.env',
});

process.env = { ...parsed, ...process.env };

const membershipUrl = process.env.MEMBERSHIP_URL;

@Injectable()
export class UserService {
  async findById(id: string): Promise<object> {
    const result = await axios({
      method: 'get',
      url: `${membershipUrl}/user/${id}`,
    });

    if (result.status !== 200) {
      throw new HttpException(result.statusText, result.status);
    }
    return result.data;
  }
}
