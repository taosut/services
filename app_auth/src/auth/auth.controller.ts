import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Param,
  Post
} from '@nestjs/common';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginPayload } from './types/loginPayload.type';
import { RefreshTokenPayload } from './types/refreshTokenPayload.type';
import { ITokenResponse } from './types/tokenResponse.type';
import { VerifyTokenPayload } from './types/verifyToken.type';

@Controller()
@ApiUseTags()
export class AuthController {
  constructor(protected readonly service: AuthService) {}

  @ApiOperation({ title: 'Login account' })
  @Post('login')
  @HttpCode(200)
  async login(
    @Body() body: LoginPayload,
    @Headers('realm') realm: string
  ): Promise<ITokenResponse> {
    return await this.service.login(body.username, body.password, realm);
  }

  @ApiOperation({ title: 'Logout current session' })
  @Post('logout')
  @HttpCode(200)
  async logout(
    @Headers('authorization') authorization: string,
    @Headers('realm') realm: string
  ): Promise<void> {
    await this.service.logout(authorization, realm);
  }

  @ApiOperation({ title: 'Get all user sessions' })
  @Get('sessions')
  async sessions(
    @Headers('authorization') authorization: string,
    @Headers('realm') realm: string
  ): Promise<any[]> {
    return await this.service.getUserSessions(authorization, realm);
  }

  @ApiOperation({ title: 'Validate token' })
  @Post('verifyToken/:realm')
  @HttpCode(200)
  async verifyToken(
    @Body() body: VerifyTokenPayload,
    @Param('realm') realm: string
  ): Promise<any> {
    let token = body.token;
    const splitBearer = token.split(' ');

    if (splitBearer.length > 0) {
      token = splitBearer[splitBearer.length - 1];
    }

    await this.service.verifyToken(token, realm);
  }

  @ApiOperation({ title: 'Validate token' })
  @Post('verifyToken')
  @HttpCode(200)
  async verifyTokenHeader(
    @Body() body: VerifyTokenPayload,
    @Headers('realm') realm: string
  ): Promise<any> {
    let token = body.token;
    const splitBearer = token.split(' ');

    if (splitBearer.length > 0) {
      token = splitBearer[splitBearer.length - 1];
    }

    await this.service.verifyToken(token, realm);
  }

  @ApiOperation({ title: 'Refresh Token' })
  @Post('refreshToken')
  @HttpCode(200)
  async refreshToken(
    @Body() body: RefreshTokenPayload,
    @Headers('realm') realm: string
  ): Promise<ITokenResponse> {
    return await this.service.refreshToken(body.refreshToken, realm);
  }
}
