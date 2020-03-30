import { DocumentBuilder, SwaggerBaseConfig } from '@nestjs/swagger';

export const SwaggerOptions = (stage: string): SwaggerBaseConfig => {
  const basePath = stage === 'LOCAL' ? '/' : '/' + stage.toLowerCase();

  const setSchemes: Array<'http' | 'https'> =
    stage === 'LOCAL' ? ['http'] : ['https'];

  return new DocumentBuilder()
    .setTitle('Payment Zencore Service')
    .setDescription('Payment Zencore Service API Documentation')
    .addBearerAuth()
    .setVersion(`${process.env.npm_package_version}-${stage.toLowerCase()}`)
    .setBasePath(basePath)
    .setSchemes(...setSchemes)
    .build();
};
