import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { Context, Handler } from 'aws-lambda';
import { createServer, proxy } from 'aws-serverless-express';
import dotenv = require('dotenv');
import express = require('express');
import { Server } from 'http';
import { mainModuleFactory } from './main.module';
import { SwaggerBuilder } from './swagger.options';
import { ErrorFilter } from './utils/error.util';

// NOTE: If you get ERR_CONTENT_DECODING_FAILED in your browser, this is likely
// due to a compressed response (e.g. gzip) which has not been handled correctly
// by aws-serverless-express and/or API Gateway. Add the necessary MIME types to
// binaryMimeTypes below
const binaryMimeTypes: string[] = [];

const cachedServers: Server[] = [];

process.on('unhandledRejection', reason => {
  console.info(reason);
});

process.on('uncaughtException', reason => {
  console.info(reason);
});

function bootstrapServer(currentStage: string, realm: string): Promise<Server> {
  try {
    const expressApp = express();

    const adapter = new ExpressAdapter(expressApp);

    return NestFactory.create(mainModuleFactory(realm), adapter, {
      logger: console,
    })
      .then(app => {
        const document = SwaggerBuilder(app, currentStage);

        expressApp.use((_, res, next) => {
          res.header('Access-Control-Allow-Origin', '*');
          res.header('Access-Control-Allow-Credentials', 'true');
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

        app.enableCors({
          credentials: true,
          allowedHeaders:
            'Content-Type,Accept,X-Amz-Date,Authorization,X-Api-Key,X-Requested-With,Realm',
        });

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
  const realm =
    (event.headers.Realm || event.headers.realm || 'agora').toLowerCase();

  if (realm === 'agora') {
    console.info('Using default realm: agora');
  }

  const currentStage: string = (process.env.STAGE || 'LOCAL').toUpperCase();

  if (!cachedServers[realm]) {
    if (currentStage === 'LOCAL') {
      const { parsed } = dotenv.config({
        path: process.cwd() + '/.env',
      });
      process.env = { ...parsed, ...process.env };
    }

    bootstrapServer(currentStage, realm).then((server: Server) => {
      cachedServers[realm] = server;
      return proxy(server, event, context);
    });
  } else {
    console.info(`Using cachedServer with realm: ${realm}`);

    return proxy(cachedServers[realm], event, context);
  }
};
