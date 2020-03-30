import { ErrorFilter } from '@magishift/util';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { SwaggerModule } from '@nestjs/swagger';
import { Context, Handler } from 'aws-lambda';
import { createServer, proxy } from 'aws-serverless-express';
import express = require('express');
import { Server } from 'http';
import { AppModule } from './app.module';
import { getSecretValue } from './aws/secretsGetSecretValue';
import { SwaggerOptions } from './swagger.options';

// NOTE: If you get ERR_CONTENT_DECODING_FAILED in your browser, this is likely
// due to a compressed response (e.g. gzip) which has not been handled correctly
// by aws-serverless-express and/or API Gateway. Add the necessary MIME types to
// binaryMimeTypes below
const binaryMimeTypes: string[] = [];

let cachedServer: Server;

process.on('unhandledRejection', reason => {
  console.error(reason);
});

process.on('uncaughtException', reason => {
  console.error(reason);
});

function bootstrapServer(currentStage: string): Promise<Server> {
  try {
    if (currentStage !== 'LOCAL') {
      getSecretValue(`LESSON_SERVICE_DB_${currentStage}`).then(data => {
        console.info(data);
      });
    }
    const expressApp = express();

    const adapter = new ExpressAdapter(expressApp);

    return NestFactory.create(AppModule, adapter)
      .then(app => {
        const document = SwaggerModule.createDocument(
          app,
          SwaggerOptions(currentStage)
        );

        expressApp.use((_, res, next) => {
          res.header('Access-Control-Allow-Origin', '*');
          res.header(
            'Access-Control-Allow-Methods',
            'GET,PUT,PATCH,POST,DELETE'
          );
          res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
          next();
        });

        expressApp.get('/swagger', (_req, res) => {
          res.send(JSON.stringify(document));
        });

        app.enableCors();

        app.useGlobalPipes(new ValidationPipe());

        app.useGlobalFilters(new ErrorFilter(Logger));

        return app.init();
      })
      .then(() => createServer(expressApp, undefined, binaryMimeTypes));
  } catch (error) {
    return Promise.reject(error);
  }
}

export const handler: Handler = (event: any, context: Context): any => {
  const currentStage: string = event ? event.requestContext.stage : 'LOCAL';
  if (!cachedServer) {
    bootstrapServer(currentStage.toUpperCase()).then(server => {
      cachedServer = server;
      return proxy(server, event, context);
    });
  } else {
    return proxy(cachedServer, event, context);
  }
};
