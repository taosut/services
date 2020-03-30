import { Injectable, HttpException } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import dotenv = require('dotenv');
import _ from 'lodash';
import { empty } from 'rxjs';

const { parsed } = dotenv.config({
  path: process.cwd() + '/.env',
});
process.env = { ...parsed, ...process.env };
// AWS.config.update({region: process.env.AWS_REGION});
@Injectable()
export default class AWSInvoker {
  private lambda: AWS.Lambda;
  constructor() {
    this.lambda = new AWS.Lambda({region: 'ap-southeast-1'});
  }

  async invoker(
      params: AWS.Lambda.Types.InvocationRequest,
    ): Promise<string> {
    try {
      const result = await this.lambda.invoke(params).promise();

      const resPayload: {
        statusCode: number;
        body: string;
        headers: any;
      } = JSON.parse(result.Payload.toString());

      if (resPayload.statusCode === 500) {
        console.info('500 resPayload', resPayload);
        throw new HttpException(
          resPayload.body && !JSON.parse(resPayload.body)
            ? resPayload.body
            : 'Error invoking lambda function ' + params.FunctionName + ' ::: ' + JSON.stringify(params.Payload),
          resPayload.statusCode,
        );
      }

      return resPayload.body;
    } catch (error) {
      throw new HttpException(error.message, error.statusCode || 500);
    }
  }
}
