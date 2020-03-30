import { ErrorFilter } from '@magishift/util';
import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerOptions } from './swagger.option';
import dotenv = require('dotenv');
import { moduleFactory } from './main.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './all-exceptions.filter';

declare const module: any;

const { parsed } = dotenv.config({
  path: process.cwd() + '/.env',
});
process.env = { ...parsed, ...process.env };
console.info(process.env);

async function bootstrap() {
  const nestApp = await NestFactory.create(
    moduleFactory(
      process.env.TYPEORM_HOST,
      process.env.TYPEORM_PASSWORD,
      process.env.TYPEORM_USERNAME,
      Number(process.env.TYPEORM_PORT),
      process.env.REDIS_HOST,
      Number(process.env.REDIS_PORT),
    ),
  );

  nestApp.useGlobalPipes(new ValidationPipe());
  nestApp.useGlobalFilters(new ErrorFilter(Logger));

  const { httpAdapter } = nestApp.get(HttpAdapterHost);

  nestApp.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  const document = SwaggerModule.createDocument(
    nestApp,
    swaggerOptions('LOCAL'),
  );
  SwaggerModule.setup('swagger', nestApp, document);

  await nestApp.listen(process.env.APP_PORT ? process.env.APP_PORT : 3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => nestApp.close());
  }
}
bootstrap();
