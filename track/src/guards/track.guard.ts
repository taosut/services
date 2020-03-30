import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard, GuardInvokeService } from '@agora-edu/auth';
import 'reflect-metadata';
import dotenv = require('dotenv');
const { parsed } = dotenv.config({
  path: process.cwd() + '/.env',
});
process.env = { ...parsed, ...process.env };

@Injectable()
export class TrackGuard extends AuthGuard {
  constructor() {
    super(
      new Reflector(),
      new GuardInvokeService(
        'ap-southeast-1',
        process.env.KEYCLOAK_SERVICE_REALM,
        process.env.KEYCLOAK_SERVICE_NAME,
      ),
    );
  }
}
