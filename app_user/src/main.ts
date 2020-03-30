import { ErrorFilter } from '@magishift/util/dist';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import dotenv = require('dotenv');
import { AppModule } from './app.module';
import { SwaggerOptions } from './swagger.options';

const { parsed } = dotenv.config({
  path: process.cwd() + '/.env',
});

process.env = { ...parsed, ...process.env };

async function bootstrap(): Promise<void> {
  const nestApp = await NestFactory.create(AppModule);

  nestApp.useGlobalFilters(new ErrorFilter(Logger));

  const document = SwaggerModule.createDocument(
    nestApp,
    SwaggerOptions('LOCAL')
  );

  SwaggerModule.setup('/swagger', nestApp, document);

  nestApp.enableCors();

  await nestApp.listen(parsed.APP_PORT);

  console.info(`Server started at http://localhost:${parsed.APP_PORT}`);
}

bootstrap();
