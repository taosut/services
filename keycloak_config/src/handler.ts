import { ErrorFilter } from '@magishift/util';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { SwaggerModule } from '@nestjs/swagger';
import { Context, Handler } from 'aws-lambda';
import { createServer, proxy } from 'aws-serverless-express';
import dotenv = require('dotenv');
import express = require('express');
import { Server } from 'http';
import { moduleFactory } from './main.module';
import { SwaggerOptions } from './swagger.options';

// NOTE: If you get ERR_CONTENT_DECODING_FAILED in your browser, this is likely
// due to a compressed response (e.g. gzip) which has not been handled correctly
// by aws-serverless-express and/or API Gateway. Add the necessary MIME types to
// binaryMimeTypes below
const binaryMimeTypes: string[] = [];

let cachedServer: Server;

process.on('unhandledRejection', reason => {
  console.info(reason);
});

process.on('uncaughtException', reason => {
  console.info(reason);
});

function bootstrapServer(
  currentStage: string,
  host: string,
  password: string,
  username: string,
  port: number,
): Promise<Server> {
  try {
    const expressApp = express();

    const adapter = new ExpressAdapter(expressApp);

    return NestFactory.create(
      moduleFactory(host, password, username, port),
      adapter,
      {
        logger: console,
      },
    )
      .then(app => {
        const document = SwaggerModule.createDocument(
          app,
          SwaggerOptions(currentStage),
        );

        expressApp.use((_, res, next) => {
          res.header('Access-Control-Allow-Origin', '*');
          res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE');
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
  const currentStage: string = (process.env.STAGE || 'LOCAL').toUpperCase();


  let host: string;
  let password: string;
  let username: string;
  let port: number;

  if (!cachedServer) {
    if (currentStage !== 'LOCAL') {
      host = process.env.DB_HOST;
      password = process.env.DB_PASSWORD;
      username = process.env.DB_USERNAME;
      port = Number(process.env.DB_PORT);
    } else {
      const { parsed } = dotenv.config({
        path: process.cwd() + '/.env',
      });
      process.env = { ...parsed, ...process.env };

      host = process.env.TYPEORM_HOST;
      password = process.env.TYPEORM_PASSWORD;
      username = process.env.TYPEORM_USERNAME;
      port = Number(process.env.TYPEORM_PORT);
    }

    bootstrapServer(currentStage, host, password, username, port).then(
      (server: Server) => {
        cachedServer = server;
        return proxy(server, event, context);
      },
    );
  } else {
    console.info('Using cachedServer');

    return proxy(cachedServer, event, context);
  }
};
