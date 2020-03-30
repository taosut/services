import { DocumentBuilder, SwaggerBaseConfig } from '@nestjs/swagger';
// import packages = require('../package.json');

export const swaggerOptions = (stage: string): SwaggerBaseConfig => {
  const setSchemes: Array<'http' | 'https'> = stage === 'LOCAL' ? ['http'] : ['https'];

  return new DocumentBuilder()
    .setTitle('Track Service')
    .setDescription('Track Service API Documentation')
    .addBearerAuth()
    .setVersion(`v1.0.0-${stage.toLowerCase()}`)
    .setSchemes(...setSchemes)
    .build();
};
