import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMetaColumnToExam1569990684322 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE `exams` ADD `meta` json NULL');
    await queryRunner.query(
      'ALTER TABLE `answers` CHANGE `score` `score` float NULL'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE `answers` CHANGE `score` `score` float(12) NULL'
    );
    await queryRunner.query('ALTER TABLE `exams` DROP COLUMN `meta`');
  }
}
