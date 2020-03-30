import { DocumentBuilder, SwaggerBaseConfig } from '@nestjs/swagger';

export const SwaggerOptions: SwaggerBaseConfig = new DocumentBuilder()
  .setTitle('Agora ID Learning Management Service Documentation')
  .setDescription('The Agora ID Learning Management Service API description')
  .setVersion('1.0')
  .build();
