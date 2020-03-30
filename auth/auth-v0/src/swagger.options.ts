import { DocumentBuilder, SwaggerBaseConfig } from '@nestjs/swagger';
import packages = require('../package.json');

export const swaggerOptions = (stage: string): SwaggerBaseConfig => {
  const setSchemes: ('http' | 'https')[] =
    stage === 'LOCAL' ? ['http'] : ['https'];

  return new DocumentBuilder()
    .setTitle('Agora Auth Service')
    .setDescription('Agora Auth Service API Documentation')
    .addBearerAuth()
    .setVersion(`${packages.version}-${stage.toLowerCase()}`)
    .setSchemes(...setSchemes)
    .build();
};
