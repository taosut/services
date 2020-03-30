import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export class BaseProfileDto {
  @ApiModelPropertyOptional()
  division?: string | null;

  @ApiModelPropertyOptional()
  position?: string | null;

  @ApiModelPropertyOptional()
  province?: string | null;

  @ApiModelPropertyOptional()
  city?: string | null;

  @ApiModelPropertyOptional()
  sub_district?: string | null;

  @ApiModelPropertyOptional()
  education?: string | null;

  @ApiModelPropertyOptional()
  phone_number?: string | null;

  @ApiModelPropertyOptional()
  photo_id?: string | null;
}

export class CreateProfileDto extends BaseProfileDto {
  @ApiModelProperty()
  account_id: string;
}

export class AccountProfileDto extends BaseProfileDto {
  @ApiModelProperty()
  username: string;

  @ApiModelProperty()
  email: string;

  @ApiModelProperty()
  firstName: string;

  @ApiModelPropertyOptional()
  lastName?: string;

  @ApiModelPropertyOptional()
  nickName?: string;
}

export class CreateAccountProfileDto extends BaseProfileDto {
  @ApiModelProperty()
  username: string;

  @ApiModelProperty()
  email: string;

  @ApiModelProperty()
  firstName: string;

  @ApiModelPropertyOptional()
  lastName?: string;

  @ApiModelPropertyOptional({ default: true })
  enabled?: boolean;

  @ApiModelPropertyOptional({ default: true })
  emailVerified?: boolean;
}

export class UpdateAccountProfileDto extends BaseProfileDto {
  @ApiModelProperty()
  username: string;

  @ApiModelProperty()
  email: string;

  @ApiModelPropertyOptional()
  firstName?: string;

  @ApiModelPropertyOptional()
  lastName?: string;

  @ApiModelPropertyOptional({ default: true })
  enabled?: boolean;

  @ApiModelPropertyOptional({ default: true })
  emailVerified?: boolean;
}

export class CreateManyAccountProfileDto {
  bulk: CreateAccountProfileDto[];
}

export class SearchAccountDto {
  @ApiModelPropertyOptional()
  max?: number;

  @ApiModelPropertyOptional()
  search?: string;
}

export class FetchByAccountIdDto {
  @ApiModelPropertyOptional()
  account_id?: string;
}

export class FetchByUsernameDto {
  @ApiModelProperty()
  username: string;
}

export class FetchByEmailDto {
  @ApiModelProperty()
  email: string;
}
