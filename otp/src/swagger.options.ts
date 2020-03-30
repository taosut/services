import { DocumentBuilder, SwaggerBaseConfig } from '@nestjs/swagger';
// import packages = require('../package.json');

export const SwaggerOptions = (stage: string): SwaggerBaseConfig => {
  const basePath = stage === 'LOCAL' ? '/' : '/' + stage.toLowerCase();

  const setSchemes: Array<'http' | 'https'> =
    stage === 'LOCAL' ? ['http'] : ['https'];

  return new DocumentBuilder()
    .setTitle('Otp Service Documentation')
    .setDescription('Otp Service API Documentation')
    .addBearerAuth()
    .setVersion(`0.0.1-${stage.toLowerCase()}`)
    .setBasePath(basePath)
    .setSchemes(...setSchemes)
    .build();
};
