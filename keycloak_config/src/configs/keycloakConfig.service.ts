import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRequest } from '@nestjsx/crud';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';
import { IKeycloakConfig } from './interfaces/keycloakConfig.interface';
import { KeycloakConfig } from './keycloakConfig.entity';
import { RealmConfigClient } from './types/realmClientConfig.type';

@Injectable()
export class KeycloakConfigService extends TypeOrmCrudService<KeycloakConfig> {
  private mainRealm: IKeycloakConfig;
  private keycloakServerUrl: string;

  constructor(
    @InjectRepository(KeycloakConfig)
    protected readonly repository: Repository<KeycloakConfig>,
  ) {
    super(repository);

    this.mainRealm = {
      realm: process.env.KEYCLOAK_REALM_MAIN,
      client: process.env.KEYCLOAK_CLIENT_MAIN,
      public: true,
    };

    this.keycloakServerUrl = `${process.env.KEYCLOAK_MAIN_AUTH_URL}/auth`;
  }

  async getConfigByName(realm: string): Promise<RealmConfigClient> {
    let realmConfig: IKeycloakConfig;

    if (realm === this.mainRealm.realm) {
      realmConfig = this.mainRealm;
    } else {
      realmConfig = await this.repository.findOne({
        realm,
      });
    }

    if (!realmConfig) {
      throw new HttpException(`Config for ${realm} not found`, 404);
    }

    return this.convertToClientConfig(realmConfig);
  }

  async createOne(
    req: CrudRequest,
    data: KeycloakConfig,
  ): Promise<KeycloakConfig> {
    if (data.realm.toLowerCase() === this.mainRealm.realm.toLowerCase()) {
      throw new Error(`Cannot create main realm ${this.mainRealm.realm}`);
    }

    return await super.createOne(req, data);
  }

  async updateOne(
    req: CrudRequest,
    config: KeycloakConfig,
  ): Promise<KeycloakConfig> {
    if (config.realm === this.mainRealm.realm) {
      throw new Error(
        `Cannot update realm main ${this.mainRealm.realm} from this endpoint, update from environment variable instead`,
      );
    }

    return await super.updateOne(req, config);
  }

  async deleteConfigByName(realm: string): Promise<boolean> {
    if (realm === this.mainRealm.realm) {
      throw new Error('Cannot delete main realm');
    }

    const realmConfig = await this.repository.findOneOrFail({
      realm,
    });

    const result = await this.repository.delete(realmConfig.id);

    if (result.affected > 0) {
      throw new HttpException('Something wrong when deleting the record', 500);
    }

    return true;
  }

  private convertToClientConfig(config: IKeycloakConfig): RealmConfigClient {
    return {
      realm: config.realm,
      authRealm: config.realm,
      resource: config.client,
      authClientId: config.client,
      authServerUrl: this.keycloakServerUrl,
      authUrl: this.keycloakServerUrl,
      public: config.public || true,
    };
  }
}
