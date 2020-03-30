import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { KeycloakConfig } from './configs/keycloakConfig.entity';
import { KeycloakConfigModule } from './configs/keycloakConfig.module';
import * as migrations from './migrations';

export function moduleFactory(
  host: string,
  password: string,
  username: string,
  port: number,
): any {
  const dbConfig: TypeOrmModuleOptions = {
    type: 'mysql',
    host,
    password,
    username,
    database: process.env.TYPEORM_DATABASE || process.env.DB_NAME,
    port,
    entities: [KeycloakConfig],
    logging: Boolean(process.env.TYPEORM_LOGGING),
    synchronize: false,
    migrationsRun: true,
    migrations: [
      migrations.InitDB1563252991383,
      migrations.RenameResourceFieldName1563948434451,
    ],
  };

  @Module({
    imports: [TypeOrmModule.forRoot(dbConfig), KeycloakConfigModule],
  })
  class KeycloakModule {}

  return KeycloakModule;
}
