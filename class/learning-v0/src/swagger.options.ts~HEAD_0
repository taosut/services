import { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerBaseConfig,
  SwaggerDocument,
  SwaggerModule,
} from '@nestjs/swagger';
import _ from 'lodash';
import packages = require('../package.json');

export function SwaggerBuilder(
  app: INestApplication,
  stage: string
): SwaggerDocument {
  const setSchemes: ('http' | 'https')[] =
    stage === 'LOCAL' ? ['http'] : ['https'];

  const option: SwaggerBaseConfig = new DocumentBuilder()
    .setTitle('Agora Class Service')
    .setDescription('Agora Class Service API Documentation')
    .addBearerAuth()
    .setVersion(`${packages.version}-${stage.toLowerCase()}`)
    .setSchemes(...setSchemes)
    .build();

  const result = SwaggerModule.createDocument(app, option);

  // Object.values(result.paths);

  _.map(result.paths, values => {
    _.map(values, value => {
      if (value.parameters && Array.isArray(value.parameters)) {
        value.parameters.push({
          type: 'string',
          name: 'realm',
          required: true,
          in: 'header',
        });
      }
    });
  });

  return result;
}
