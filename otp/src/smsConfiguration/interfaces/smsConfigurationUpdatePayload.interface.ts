import { ApiModelProperty } from '@nestjs/swagger';

export abstract class ISmsConfigurationUpdatePayload {
  @ApiModelProperty({ required: false })
  isActive?: boolean;

  @ApiModelProperty({ required: false })
  accountSid?: string;

  @ApiModelProperty({ required: false })
  authToken?: string;

  @ApiModelProperty({ required: false })
  sender?: string;
}
