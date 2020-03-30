// Load dot environment before load other modules
import dotenv = require('dotenv');
const { parsed } = dotenv.config({
  path: process.cwd() + '/.env',
});
process.env = { ...parsed, ...process.env };

import { ErrorFilter } from '@magishift/util';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { moduleFactory } from './app.module';
import { SwaggerOptions } from './swagger.options';

async function bootstrap(): Promise<void> {
  const nestApp = await NestFactory.create(
    moduleFactory(
      process.env.TYPEORM_HOST,
      process.env.TYPEORM_PASSWORD,
      process.env.TYPEORM_USERNAME,
      Number(process.env.TYPEORM_PORT),
    ),
  );

  nestApp.useGlobalFilters(new ErrorFilter(Logger));

  const document = SwaggerModule.createDocument(
    nestApp,
    SwaggerOptions('LOCAL'),
  );

  SwaggerModule.setup('/swagger', nestApp, document);

  nestApp.enableCors();

  await nestApp.listen(parsed.APP_PORT);

  // tslint:disable-next-line: no-console
  console.info(`Server started at http://localhost:${parsed.APP_PORT}`);
}

bootstrap();
