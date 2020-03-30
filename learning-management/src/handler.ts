import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { Context, Handler } from 'aws-lambda';
import { createServer, proxy } from 'aws-serverless-express';
import { Server } from 'http';
import { ApplicationModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { SwaggerOptions } from './swagger.option';

// NOTE: If you get ERR_CONTENT_DECODING_FAILED in your browser, this is likely
// due to a compressed response (e.g. gzip) which has not been handled correctly
// by aws-serverless-express and/or API Gateway. Add the necessary MIME types to
// binaryMimeTypes below
const binaryMimeTypes: string[] = [];

let cachedServer: Server;

process.on('unhandledRejection', reason => {
  // tslint:disable-next-line:no-console
  console.error(reason);
});

process.on('uncaughtException', reason => {
  // tslint:disable-next-line:no-console
  console.error(reason);
});

async function bootstrapServer(): Promise<Server> {
  try {
    const expressApp = require('express')();

    const adapter = new ExpressAdapter(expressApp);

    return NestFactory.create(ApplicationModule, adapter)
      .then(app => {
        const document = SwaggerModule.createDocument(
          app,
          SwaggerOptions,
        );

        expressApp.use((_, res, next) => {
          res.header('Access-Control-Allow-Origin', '*');
          res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE');
          res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
          next();
        });

// tslint:disable-next-line: variable-name
        expressApp.get('/swagger', (_req, res) => {
          res.send(JSON.stringify(document));
        });

        app.enableCors();

        return app.init();
      })
      .then(() => createServer(expressApp, undefined, binaryMimeTypes));
  } catch (error) {
    return Promise.reject(error);
  }
}

export const handler: Handler = ( event: any, context: Context): any => {
  if (!cachedServer) {
    bootstrapServer().then(server => {
      cachedServer = server;
      return proxy(server, event, context);
    });
  } else {
    return proxy(cachedServer, event, context);
  }

};
