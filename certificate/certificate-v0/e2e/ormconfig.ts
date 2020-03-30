import { TypeOrmModule } from '@nestjs/typeorm';
import dotenv = require('dotenv');
import { Certificate } from '../src/certificate/certificate.entity';
import { CertificateModule } from '../src/certificate/certificate.module';

// Load dot environment before load other modules
const { parsed } = dotenv.config({
  path: process.cwd() + '/.env',
});
process.env = { ...parsed, ...process.env };

export const ormconfig = {
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.TYPEORM_HOST,
      password: process.env.TYPEORM_PASSWORD,
      username: process.env.TYPEORM_USERNAME,
      database: process.env.TYPEORM_DATABASE + '_test',
      port: Number(process.env.TYPEORM_PORT),
      entities: [Certificate],
      logging: Boolean(process.env.TYPEORM_LOGGING),
      synchronize: true,
      dropSchema: true,
    }),
    CertificateModule,
  ],
};
