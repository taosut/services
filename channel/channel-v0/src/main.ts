// Load dot environment before load other modules
import dotenv = require('dotenv');
const { parsed } = dotenv.config({
  path: process.cwd() + '/.env',
});
process.env = { ...parsed, ...process.env };

import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { moduleFactory } from './app.module';
import { HttpExceptionFilter } from './http-exceptions.filter';
import { SwaggerBuilder } from './swagger.options';

async function bootstrap(): Promise<void> {
  const nestApp = await NestFactory.create(
    moduleFactory(
      process.env.TYPEORM_HOST,
      process.env.TYPEORM_PASSWORD,
      process.env.TYPEORM_USERNAME,
      Number(process.env.TYPEORM_PORT)
    )
  );

  const document = SwaggerBuilder(nestApp, 'LOCAL');

  SwaggerModule.setup('/swagger', nestApp, document);

  nestApp.enableCors();

  nestApp.useGlobalFilters(new HttpExceptionFilter());

  await nestApp.listen(parsed.APP_PORT);

  console.info(`Server started at http://localhost:${parsed.APP_PORT}`);
}

bootstrap();
