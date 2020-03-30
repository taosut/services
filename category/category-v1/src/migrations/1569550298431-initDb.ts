import { MigrationInterface, QueryRunner } from 'typeorm';

export class initDb1569550298431 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE `sub_category` DROP COLUMN `createdAt`',
      undefined
    );
    await queryRunner.query(
      'ALTER TABLE `sub_category` DROP COLUMN `updatedAt`',
      undefined
    );
    await queryRunner.query(
      'ALTER TABLE `category` DROP COLUMN `createdAt`',
      undefined
    );
    await queryRunner.query(
      'ALTER TABLE `category` DROP COLUMN `updatedAt`',
      undefined
    );
    await queryRunner.query(
      'ALTER TABLE `sub_category` ADD `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6)',
      undefined
    );
    await queryRunner.query(
      'ALTER TABLE `sub_category` ADD `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6)',
      undefined
    );
    await queryRunner.query(
      'ALTER TABLE `category` ADD `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6)',
      undefined
    );
    await queryRunner.query(
      'ALTER TABLE `category` ADD `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6)',
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE `category` DROP COLUMN `updated_at`',
      undefined
    );
    await queryRunner.query(
      'ALTER TABLE `category` DROP COLUMN `created_at`',
      undefined
    );
    await queryRunner.query(
      'ALTER TABLE `sub_category` DROP COLUMN `updated_at`',
      undefined
    );
    await queryRunner.query(
      'ALTER TABLE `sub_category` DROP COLUMN `created_at`',
      undefined
    );
    await queryRunner.query(
      'ALTER TABLE `category` ADD `updatedAt` datetime(6) NULL DEFAULT \'CURRENT_TIMESTAMP(6)\'',
      undefined
    );
    await queryRunner.query(
      'ALTER TABLE `category` ADD `createdAt` datetime(6) NULL DEFAULT \'CURRENT_TIMESTAMP(6)\'',
      undefined
    );
    await queryRunner.query(
      'ALTER TABLE `sub_category` ADD `updatedAt` datetime(6) NULL DEFAULT \'CURRENT_TIMESTAMP(6)\'',
      undefined
    );
    await queryRunner.query(
      'ALTER TABLE `sub_category` ADD `createdAt` datetime(6) NULL DEFAULT \'CURRENT_TIMESTAMP(6)\'',
      undefined
    );
  }
}
