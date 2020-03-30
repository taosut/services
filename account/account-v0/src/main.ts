import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import dotenv = require('dotenv');
import { mainModuleFactory } from './main.module';
import { SwaggerBuilder } from './swagger.options';
import { ErrorFilter } from './utils/error.util';

const { parsed } = dotenv.config({
  path: process.cwd() + '/.env',
});
process.env = { ...parsed, ...process.env };

async function bootstrap(): Promise<void> {
  const nestApp = await NestFactory.create(
    mainModuleFactory(process.env.KEYCLOAK_REALM_MAIN)
  );

  nestApp.useGlobalFilters(new ErrorFilter(Logger));

  const document = SwaggerBuilder(nestApp, 'LOCAL');

  SwaggerModule.setup('/swagger', nestApp, document);

  nestApp.enableCors();

  await nestApp.listen(parsed.APP_PORT);

  console.info(`Server started at http://localhost:${parsed.APP_PORT}`);
}

bootstrap();
