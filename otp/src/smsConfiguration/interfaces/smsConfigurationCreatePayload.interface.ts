import { ApiModelProperty } from '@nestjs/swagger';

export abstract class ISmsConfigurationCreatePayload {
  id?: string;

  @ApiModelProperty()
  isActive: boolean;

  @ApiModelProperty()
  accountSid: string;

  @ApiModelProperty()
  authToken: string;

  @ApiModelProperty()
  sender: string;
}
