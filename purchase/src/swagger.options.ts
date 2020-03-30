import { DocumentBuilder, SwaggerBaseConfig } from '@nestjs/swagger';

export const SwaggerOptions: SwaggerBaseConfig = new DocumentBuilder()
  .setTitle('Purchase Service Documentation')
  .setDescription('The Purchase Service API description')
  .setVersion('1.0')
  .build();
