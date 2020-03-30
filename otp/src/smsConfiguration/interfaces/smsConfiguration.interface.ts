import { ApiModelProperty } from '@nestjs/swagger';

export abstract class ISmsConfiguration {
  @ApiModelProperty()
  id: string;

  @ApiModelProperty({
    example: true,
  })
  isActive: boolean;

  @ApiModelProperty({
    example: 'ACd2b7b1f1126a71e6887ac2f92ed1cb29',
  })
  accountSid: string;

  @ApiModelProperty({
    example: '8be647809c83d09f94998ea14cc62ebb',
  })
  authToken: string;

  @ApiModelProperty({
    example: '+14086693375',
  })
  sender: string;
}
