import { MigrationInterface, QueryRunner } from 'typeorm';

export class InvoiceTimestamp1564059645714 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE `invoice` ADD `timestamp` datetime NULL',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE `invoice` DROP COLUMN `timestamp`');
  }
}
