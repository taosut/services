import { ApiModelProperty } from '@nestjs/swagger';

export abstract class ISmsOtpUpdatePayload {
  @ApiModelProperty({ required: false })
  phoneNumber?: string;

  @ApiModelProperty({ required: false })
  otp?: string;

  @ApiModelProperty({ required: false })
  invalid?: number;
}
