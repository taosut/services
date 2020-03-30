import { HttpException, Injectable } from '@nestjs/common';
import { Lambda } from 'aws-sdk';
// import axios from 'axios';
import dotenv = require('dotenv');
import _ = require('lodash');

const { parsed } = dotenv.config({
  path: process.cwd() + '/.env',
});

process.env = { ...parsed, ...process.env };

@Injectable()
export class SubCategoryService {
  private lambda: Lambda = new Lambda();

  async findById(id: string): Promise<any> {
    const headers: any = {};
    headers.accept = 'application/json';
    headers['Content-Type'] = 'application/json';

    const params: Lambda.Types.InvocationRequest = {
      FunctionName: process.env.CATEGORY_SERVICE_NAME,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({
        headers,
        resource: '/{proxy+}',
        path: `/sub-category/${id}`,
        httpMethod: 'GET',
      }),
    };

    const resultStr = await this.invoker(params);

    if (resultStr && this.isJSON(resultStr)) {
      const result = JSON.parse(resultStr) as {
        statusCode?: number;
        statusText?: string;
        message?: string;
        data?: object;
        error?: object;
      };

      if (result.statusCode) {
        throw new HttpException(
          result.data ||
            result.message ||
            result.statusText ||
            'Error on fetching data',
          result.statusCode || 404
        );
      }
      return result;
    }
  }

  private async invoker(
    params: Lambda.Types.InvocationRequest
  ): Promise<string> {
    try {
      const result = await this.lambda.invoke(params).promise();

      const resPayload: {
        statusCode: number;
        body: string;
        headers: any;
      } = JSON.parse(result.Payload.toString());

      if (resPayload.statusCode === 500) {
        throw new HttpException(
          resPayload.body && !_.isEmpty(JSON.parse(resPayload.body))
            ? resPayload.body
            : 'Error invoking lambda function ' + params.FunctionName,
          resPayload.statusCode
        );
      }

      return resPayload.body;
    } catch (error) {
      throw new HttpException(error.message, error.statusCode || 500);
    }
  }

  private isJSON(str: string): boolean {
    try {
      const obj = JSON.parse(str);
      if (obj && typeof obj === 'object' && obj !== null) {
        return true;
      }
    } catch (err) {
      return false;
    }
  }
}
