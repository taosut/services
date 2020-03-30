import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnCaseStudy1570681464451 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE `answers` DROP FOREIGN KEY `FK_677120094cf6d3f12df0b9dc5d3`'
    );
    await queryRunner.query('ALTER TABLE `exams` ADD `case_study` text NULL');
    await queryRunner.query(
      'ALTER TABLE `answers` CHANGE `score` `score` float NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `answers` ADD CONSTRAINT `FK_677120094cf6d3f12df0b9dc5d3` FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE `answers` DROP FOREIGN KEY `FK_677120094cf6d3f12df0b9dc5d3`'
    );
    await queryRunner.query(
      'ALTER TABLE `answers` CHANGE `score` `score` float(12) NULL'
    );
    await queryRunner.query('ALTER TABLE `exams` DROP COLUMN `case_study`');
    await queryRunner.query(
      'ALTER TABLE `answers` ADD CONSTRAINT `FK_677120094cf6d3f12df0b9dc5d3` FOREIGN KEY (`question_id`, `question_id`) REFERENCES `questions`(`id`,`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }
}
