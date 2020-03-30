import { ApiModelProperty } from '@nestjs/swagger';
import RealmRepresentation from 'keycloak-admin/lib/defs/realmRepresentation';

export class RealmConfigClient {
  @ApiModelProperty()
  realm: string;

  @ApiModelProperty()
  authRealm: string;

  @ApiModelProperty()
  resource: string;

  @ApiModelProperty()
  authClientId: string;

  @ApiModelProperty()
  authServerUrl: string;

  @ApiModelProperty()
  authUrl: string;

  @ApiModelProperty()
  public: boolean;

  @ApiModelProperty({ readOnly: true })
  clients?: RealmRepresentation;
}
