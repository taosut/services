import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameResourceFieldName1563948434451
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE `keycloak_config` DROP COLUMN `publicId`'
    );
    await queryRunner.query(
      'ALTER TABLE `keycloak_config` DROP COLUMN `isDeleted`'
    );
    await queryRunner.query(
      'ALTER TABLE `keycloak_config` DROP COLUMN `__meta`'
    );
    await queryRunner.query(
      'ALTER TABLE `keycloak_config` CHANGE COLUMN `resource` `client` varchar(255)'
    );
    await queryRunner.query(
      'ALTER TABLE `keycloak_config` ADD `createdAt` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6)'
    );
    await queryRunner.query(
      'ALTER TABLE `keycloak_config` ADD `updatedAt` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6)'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE `keycloak_config` DROP COLUMN `updatedAt`'
    );
    await queryRunner.query(
      'ALTER TABLE `keycloak_config` DROP COLUMN `createdAt`'
    );
    await queryRunner.query(
      'ALTER TABLE `keycloak_config` CHANGE COLUMN `client` `resource`  varchar(255)'
    );
    await queryRunner.query(
      'ALTER TABLE `keycloak_config` ADD `__meta` text NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `keycloak_config` ADD `isDeleted` tinyint NOT NULL DEFAULT \'0\''
    );

    await queryRunner.query(
      'ALTER TABLE `keycloak_config` ADD `publicId` varchar(255) NOT NULL'
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `IDX_a987b7e46cbaa7c3aafeca33df` ON `keycloak_config` (`publicId`)'
    );
  }
}
