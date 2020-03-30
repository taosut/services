import { DocumentBuilder, SwaggerBaseConfig } from '@nestjs/swagger';
import packages = require('../package.json.js');

export const SwaggerOptions = (stage: string): SwaggerBaseConfig => {
  const setSchemes: ('http' | 'https')[] =
    stage === 'LOCAL' ? ['http'] : ['https'];

  return new DocumentBuilder()
    .setTitle('Keycloak Service')
    .setDescription('Keycloak Service API Documentation')
    .addBearerAuth()
    .setVersion(`${packages.version}-${stage.toLowerCase()}`)
    .setSchemes(...setSchemes)
    .build();
};
