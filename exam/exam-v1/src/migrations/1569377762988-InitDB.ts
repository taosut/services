import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDB1569377762988 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'CREATE TABLE `answers` (`id` varchar(255) NOT NULL, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `answer` varchar(255) NOT NULL, `correct` tinyint NOT NULL DEFAULT 0, `score` float NULL, `question_id` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `questions` (`id` varchar(255) NOT NULL, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `question` text NOT NULL, `exam_id` varchar(255) NOT NULL, `type` varchar(255) NULL DEFAULT \'MULTIPLE_CHOICE\', `deleted_at` datetime NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `exams` (`id` varchar(255) NOT NULL, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `title` varchar(200) NOT NULL, `description` text NULL, `duration` int NOT NULL DEFAULT 0, `published` tinyint NOT NULL DEFAULT 0, `started_at` datetime NULL, `ended_at` datetime NULL, `deleted_at` datetime NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'ALTER TABLE `answers` ADD CONSTRAINT `FK_677120094cf6d3f12df0b9dc5d3` FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `questions` ADD CONSTRAINT `FK_f912d2c24bc84f66e0a40b1c169` FOREIGN KEY (`exam_id`) REFERENCES `exams`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE `questions` DROP FOREIGN KEY `FK_f912d2c24bc84f66e0a40b1c169`'
    );
    await queryRunner.query(
      'ALTER TABLE `answers` DROP FOREIGN KEY `FK_677120094cf6d3f12df0b9dc5d3`'
    );
    await queryRunner.query('DROP TABLE `exams`');
    await queryRunner.query('DROP TABLE `questions`');
    await queryRunner.query('DROP TABLE `answers`');
  }
}
