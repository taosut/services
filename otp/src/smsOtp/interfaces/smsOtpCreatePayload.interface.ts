import { ApiModelProperty } from '@nestjs/swagger';

export abstract class ISmsOtpCreatePayload {
  @ApiModelProperty({ required: false })
  id?: string;

  @ApiModelProperty()
  phoneNumber: string;

  @ApiModelProperty()
  otp: string;

  @ApiModelProperty()
  invalid: number;
}
