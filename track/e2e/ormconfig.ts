import { TypeOrmModule } from '@nestjs/typeorm';
import { Track } from '../src/track/track.entity';
import * as migration from '../src/migrations';
import dotenv = require('dotenv');
import { TrackModule } from '../src/track/track.module';

const { parsed } = dotenv.config({
path: process.cwd() + '/.env.test',
});
process.env = { ...parsed, ...process.env };

export const ormconfig = {
      imports: [
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: process.env.TYPEORM_HOST,
          database: process.env.TYPEORM_DATABASE,
          username: process.env.TYPEORM_USERNAME,
          password: process.env.TYPEORM_PASSWORD,
          port: Number(process.env.TYPEORM_PORT),
          entities: [Track],
          synchronize: false,
          migrationsRun: true,
          migrations: [
            migration.TrackMigration1564048562216,
            migration.AddColumnIndexLearningsToTrack1564382303837,
          ],
        }),
        TrackModule,
      ],
    };
