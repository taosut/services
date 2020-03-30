import { Module } from '@nestjs/common';
import { AccountController } from './account/account.controller';
import { KeycloakAccountService } from './keycloak/keycloakAccount.service';
import { KeycloakAdminService } from './keycloak/keycloakAdmin.service';
import { KeycloakRoleService } from './keycloak/keycloakRole.service';

export function mainModuleFactory(realm: string): any {
  @Module({
    providers: [
      {
        provide: KeycloakAccountService,
        useValue: new KeycloakAccountService(
          realm,
          new KeycloakAdminService(realm)
        ),
      },
      {
        provide: KeycloakRoleService,
        useValue: new KeycloakRoleService(
          realm,
          new KeycloakAdminService(realm)
        ),
      },
    ],
    exports: [KeycloakAccountService, KeycloakRoleService],
    controllers: [AccountController],
  })
  class KeycloakModule {}

  return KeycloakModule;
}
