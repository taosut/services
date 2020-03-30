import { Module } from '@nestjs/common';
import { KeycloakAuthModule } from './auth/auth.module';

export function moduleFactory(): any {
  @Module({
    imports: [KeycloakAuthModule],
  })
  class MainModule {}

  return MainModule;
}
