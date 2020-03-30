import { NestFactory } from "@nestjs/core";
import { Logger } from "@nestjs/common";
import { Seeder } from "./database/seeders/seeder";
import { SeederModule } from "./database/seeders/seeder.module";
const promiseFinally = require('promise.prototype.finally');

// Add `finally()` to `Promise.prototype`
promiseFinally.shim();

async function bootstrap() {
    NestFactory.createApplicationContext(SeederModule)
      .then(appContext => {
        const logger = appContext.get(Logger);
        const seeder = appContext.get(Seeder);
        seeder
          .seed()
          .then(() => {
            logger.debug('Seeding complete!');
            appContext.close();
          })
          .catch(error => {
            logger.error('Seeding failed!');
            appContext.close();
            throw error;
          })
          // .finally(() => appContext.close());
      })
      .catch(error => {
        throw error;
      });
  }
  bootstrap();