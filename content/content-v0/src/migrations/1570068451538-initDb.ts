import { MigrationInterface, QueryRunner } from 'typeorm';

export class initDb1570068451538 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE `content` DROP COLUMN `fileType`',
      undefined
    );
    await queryRunner.query(
      'ALTER TABLE `content` DROP COLUMN `uploadedBy`',
      undefined
    );
    await queryRunner.query(
      'ALTER TABLE `content` ADD `file_type` varchar(255) NOT NULL',
      undefined
    );
    await queryRunner.query(
      'ALTER TABLE `content` ADD `uploaded_by` varchar(255) NOT NULL',
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE `content` DROP COLUMN `uploaded_by`',
      undefined
    );
    await queryRunner.query(
      'ALTER TABLE `content` DROP COLUMN `file_type`',
      undefined
    );
    await queryRunner.query(
      'ALTER TABLE `content` ADD `uploadedBy` varchar(255) NOT NULL',
      undefined
    );
    await queryRunner.query(
      'ALTER TABLE `content` ADD `fileType` varchar(255) NOT NULL',
      undefined
    );
  }
}
