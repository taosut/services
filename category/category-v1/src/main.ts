import dotenv = require('dotenv');

import { ErrorFilter } from '@magishift/util/dist';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { moduleFactory } from './app.module';
import { SwaggerBuilder } from './swagger.options';

const { parsed } = dotenv.config({
  path: process.cwd() + '/.env',
});
process.env = { ...parsed, ...process.env };

async function bootstrap(): Promise<void> {
  const nestApp = await NestFactory.create(
    moduleFactory(
      process.env.TYPEORM_HOST,
      process.env.TYPEORM_PASSWORD,
      process.env.TYPEORM_USERNAME,
      Number(process.env.TYPEORM_PORT)
    )
  );

  nestApp.useGlobalFilters(new ErrorFilter(Logger));

  const document = SwaggerBuilder(nestApp, 'LOCAL');

  SwaggerModule.setup('/swagger', nestApp, document);

  nestApp.enableCors();

  await nestApp.listen(parsed.APP_PORT);

  console.info(`Server started at http://localhost:${parsed.APP_PORT}`);
  console.info(
    `Swagger started at http://localhost:${parsed.APP_PORT}/swagger`
  );
}

bootstrap();
