import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeycloakConfigController } from './keycloakConfig.controller';
import { KeycloakConfig } from './keycloakConfig.entity';
import { KeycloakConfigService } from './keycloakConfig.service';

@Module({
  imports: [TypeOrmModule.forFeature([KeycloakConfig])],
  controllers: [KeycloakConfigController],
  providers: [KeycloakConfigService],
  exports: [KeycloakConfigService],
})
export class KeycloakConfigModule {}
