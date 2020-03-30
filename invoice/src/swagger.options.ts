import { DocumentBuilder, SwaggerBaseConfig } from '@nestjs/swagger';
import packages = require('../package.json');

export const SwaggerOptions = (stage: string): SwaggerBaseConfig => {
  const setSchemes: Array<'http' | 'https'> =
    stage === 'LOCAL' ? ['http'] : ['https'];

  return new DocumentBuilder()
    .setTitle('Product Service')
    .setDescription('Product Service API Documentation')
    .addBearerAuth()
    .setVersion(`${packages.version}-${stage.toLowerCase()}`)
    .setSchemes(...setSchemes)
    .build();
};
