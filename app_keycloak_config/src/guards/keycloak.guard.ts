import { AuthGuard, GuardInvokeService } from '@agora-edu/auth';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import 'reflect-metadata';

@Injectable()
export class KeycloakGuard extends AuthGuard {
  constructor() {
    super(
      new Reflector(),
      new GuardInvokeService(
        process.env.AWS_REGION,
        process.env.GUARD_AUTH_SERVICE_NAME
      )
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (process.env.DISABLE_GUARD) {
      return true;
    }

    return await super.canActivate(context);
  }
}
