import { ApiModelProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray } from 'class-validator';
import RoleRepresentation from 'keycloak-admin/lib/defs/roleRepresentation';
import { ERoles } from './role.enum';

export default abstract class Role implements RoleRepresentation {
  clientRole?: boolean;

  composite?: boolean;

  composites?: {
    client: Record<string, any>;
    realm: string[];
  };

  containerId?: string;

  @ApiModelProperty({ required: false })
  description?: string;

  id?: string;

  name?: string;
}

export class RoleMappingPayload extends Role {
  @ApiModelProperty()
  id: string;

  @ApiModelProperty({ required: false })
  name: string;

  @ApiModelProperty({ required: false })
  description?: string;
}

export class RoleMappingPayloadUpdate extends Role {
  @ApiModelProperty({ readOnly: true })
  id: string;

  @ApiModelProperty({ readOnly: true })
  name: string;
}

export class RolePayload {
  @IsArray()
  @ArrayNotEmpty()
  @ApiModelProperty({ enum: ERoles, isArray: true, type: String })
  roles: ERoles[];
}
