import { ErrorFilter } from '@magishift/util/dist';
import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { Context, Handler } from 'aws-lambda';
import { createServer, proxy } from 'aws-serverless-express';
import express = require('express');
import { Server } from 'http';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { moduleFactory } from './app.module';
import { getSecretValue } from './services/secretManager.service';
import { SwaggerBuilder } from './swagger.option';

// NOTE: If you get ERR_CONTENT_DECODING_FAILED in your browser, this is likely
// due to a compressed response (e.g. gzip) which has not been handled correctly
// by aws-serverless-express and/or API Gateway. Add the necessary MIME types to
// binaryMimeTypes below
const binaryMimeTypes: string[] = [];

// const cachedServers: { key: string; server: Server }[];
const cachedServers: Server[] = [];

process.on('unhandledRejection', reason => {
  console.error(reason);
});

process.on('uncaughtException', reason => {
  console.error(reason);
});

function bootstrapServer(
  currentStage: string,
  host: string,
  password: string,
  username: string,
  port: number,
  redisHost: string,
  redisPort: number
): Promise<Server> {
  try {
    const expressApp = express();

    const adapter = new ExpressAdapter(expressApp);

    return NestFactory.create(
      moduleFactory(host, password, username, port, redisHost, redisPort),
      adapter
    )
      .then(app => {
        const document = SwaggerBuilder(app, currentStage);

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

        app.enableCors({
          credentials: true,
          allowedHeaders:
            'Content-Type,Accept,X-Amz-Date,Authorization,X-Api-Key,X-Requested-With,Realm',
        });

        app.useGlobalPipes(new ValidationPipe());

        app.useGlobalFilters(new ErrorFilter(Logger));

        const { httpAdapter } = app.get(HttpAdapterHost);

        app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

        return app.init();
      })
      .then(() => createServer(expressApp, undefined, binaryMimeTypes));
  } catch (error) {
    return Promise.reject(error);
  }
}

export const handler: Handler = (event: any, context: Context): any => {
  const currentStage: string = (process.env.STAGE || 'LOCAL').toUpperCase();

  const realm = event.headers.Realm || event.headers.realm || 'agora';

  if (realm === 'agora') {
    console.info('Using default realm: agora');
  }

  if (!cachedServers[realm]) {
    let host: string;
    let password: string;
    let username: string;
    let port: number;
    let redisHost: string;
    let redisPort: number;

    if (currentStage !== 'LOCAL') {
      const asmDBConf = `${
        process.env.DB_CONF_PREFIX
      }${realm.toLowerCase()}/${currentStage.toLowerCase()}`;

      getSecretValue(asmDBConf, (_err, data) => {
        host = data.host;
        password = data.password;
        username = data.username;
        port = Number(data.port);
        redisHost = data.redisHost;
        redisPort = Number(data.redisPort);

        process.env = {
          ...process.env,
          realm,
          STAGE: currentStage,
          REDIS_HOST: redisHost,
          REDIS_PORT: String(redisPort),
        };

        bootstrapServer(currentStage, host, password, username, port, redisHost, redisPort).then(
          (server: Server) => {
            cachedServers[realm] = server;
            return proxy(server, event, context);
          }
        );
      });
    } else {
      host = process.env.TYPEORM_HOST;
      password = process.env.TYPEORM_PASSWORD;
      username = process.env.TYPEORM_USERNAME;
      port = Number(process.env.TYPEORM_PORT);
      redisHost = process.env.REDIS_HOST;
      redisPort = Number(process.env.REDIS_PORT);

      bootstrapServer(currentStage, host, password, username, port, redisHost, redisPort).then(
        (server: Server) => {
          cachedServers[realm] = server;
          return proxy(server, event, context);
        }
      );
    }
  } else {
    return proxy(cachedServers[realm], event, context);
  }
};
