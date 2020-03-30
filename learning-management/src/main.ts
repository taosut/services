import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ApplicationModule } from './app.module';
import { SwaggerOptions } from './swagger.option';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);
  // app.setGlobalPrefix('v1');

  const document = SwaggerModule.createDocument(app, SwaggerOptions);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
