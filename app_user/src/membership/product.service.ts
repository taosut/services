import { Injectable } from '@nestjs/common';
import axios from 'axios';
import dotenv = require('dotenv');
import { EProductType } from './interfaces/membership.interface';

const { parsed } = dotenv.config({
  path: process.cwd() + '/.env',
});

process.env = { ...parsed, ...process.env };

const lessonUrl = process.env.LESSON_URL;
const channelUrl = process.env.CHANNEL_URL;

@Injectable()
export class ProductService {
  async getProductByProductId(
    productType: string,
    productId: string
  ): Promise<any> {
    let result = null;
    if (productType === EProductType.lesson) {
      result = await axios({
        method: 'get',
        url: `${lessonUrl}/lesson/${productId}`,
      })
        .then(response => {
          return response.data;
        })
        .catch(e => {
          throw new Error(e);
        });
    }

    if (productType === EProductType.channel) {
      result = await axios({
        method: 'get',
        url: `${channelUrl}/channel/${productId}`,
      })
        .then(response => {
          return response.data;
        })
        .catch(e => {
          throw new Error(e);
        });
    }

    return result;
  }
}
