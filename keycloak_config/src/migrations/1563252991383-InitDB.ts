import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDB1563252991383 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'CREATE TABLE `keycloak_config` (`id` varchar(36) NOT NULL, `publicId` varchar(255) NOT NULL, \
      `isDeleted` tinyint NOT NULL DEFAULT 0, `__meta` text NULL, \
      `realm` varchar(255) NOT NULL, `resource` varchar(255) NOT NULL, `public` tinyint NOT NULL DEFAULT 1, \
      UNIQUE INDEX `IDX_a987b7e46cbaa7c3aafeca33df` (`publicId`), \
      UNIQUE INDEX `IDX_2eb8b3568e9d8aec4750c8c3fc` (`realm`), PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'DROP INDEX `IDX_2eb8b3568e9d8aec4750c8c3fc` ON `keycloak_config`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_a987b7e46cbaa7c3aafeca33df` ON `keycloak_config`'
    );
    await queryRunner.query('DROP TABLE `keycloak_config`');
  }
}
