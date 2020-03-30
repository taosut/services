import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDB1568609868555 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'CREATE TABLE `attempt_details` (`id` varchar(255) NOT NULL, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `question` text NOT NULL, `sort_order` int NOT NULL, `question_id` varchar(255) NOT NULL, `choosen_answer_ids` text NULL, `correct_answer_ids` text NULL, `attempt_id` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `answers` (`id` varchar(255) NOT NULL, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `answer` varchar(255) NOT NULL, `correct` tinyint NOT NULL DEFAULT 0, `score` float NULL, `question_id` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `questions` (`id` varchar(255) NOT NULL, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `question` text NOT NULL, `exam_id` varchar(255) NOT NULL, `type` varchar(255) NULL DEFAULT \'MULTIPLE_CHOICE\', `deleted_at` datetime NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `exams` (`id` varchar(255) NOT NULL, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `title` varchar(200) NOT NULL, `description` text NULL, `duration` int NOT NULL DEFAULT 0, `published` tinyint NOT NULL DEFAULT 0, `started_at` datetime NULL, `ended_at` datetime NULL, `part_of` varchar(255) NULL DEFAULT \'UNIT\', `part_of_id` varchar(255) NULL, `deleted_at` datetime NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `attempts` (`id` varchar(255) NOT NULL, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `total_attempted` int NOT NULL DEFAULT 1, `total_correct` int NULL, `total_question` int NULL, `latest_score` varchar(255) NULL, `elapsed_time` int NULL, `finished` tinyint NOT NULL DEFAULT 0, `latest_started_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, `exam_id` varchar(255) NOT NULL, `user_id` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'ALTER TABLE `attempt_details` ADD CONSTRAINT `FK_df03431d914759b9a4671987847` FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `attempt_details` ADD CONSTRAINT `FK_e9d57f0a95f1cc598d494e27b42` FOREIGN KEY (`attempt_id`) REFERENCES `attempts`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `answers` ADD CONSTRAINT `FK_677120094cf6d3f12df0b9dc5d3` FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `questions` ADD CONSTRAINT `FK_f912d2c24bc84f66e0a40b1c169` FOREIGN KEY (`exam_id`) REFERENCES `exams`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `attempts` ADD CONSTRAINT `FK_d167176b022a0f255e652f07f48` FOREIGN KEY (`exam_id`) REFERENCES `exams`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE `attempts` DROP FOREIGN KEY `FK_d167176b022a0f255e652f07f48`'
    );
    await queryRunner.query(
      'ALTER TABLE `questions` DROP FOREIGN KEY `FK_f912d2c24bc84f66e0a40b1c169`'
    );
    await queryRunner.query(
      'ALTER TABLE `answers` DROP FOREIGN KEY `FK_677120094cf6d3f12df0b9dc5d3`'
    );
    await queryRunner.query(
      'ALTER TABLE `attempt_details` DROP FOREIGN KEY `FK_e9d57f0a95f1cc598d494e27b42`'
    );
    await queryRunner.query(
      'ALTER TABLE `attempt_details` DROP FOREIGN KEY `FK_df03431d914759b9a4671987847`'
    );
    await queryRunner.query('DROP TABLE `attempts`');
    await queryRunner.query('DROP TABLE `exams`');
    await queryRunner.query('DROP TABLE `questions`');
    await queryRunner.query('DROP TABLE `answers`');
    await queryRunner.query('DROP TABLE `attempt_details`');
  }
}
