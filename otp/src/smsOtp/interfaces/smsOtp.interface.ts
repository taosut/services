import { ApiModelProperty } from '@nestjs/swagger';

export abstract class ISmsOtp {
  @ApiModelProperty()
  id: string;

  @ApiModelProperty()
  phoneNumber: string;

  @ApiModelProperty()
  otp: string;

  @ApiModelProperty()
  invalid: number;
}
