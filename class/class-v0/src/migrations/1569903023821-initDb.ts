import { MigrationInterface, QueryRunner } from 'typeorm';

export class initDb1569903023821 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'CREATE TABLE `audio_track` (`id` varchar(36) NOT NULL, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `title` varchar(255) NOT NULL, `time` varchar(255) NOT NULL, `minute` varchar(255) NOT NULL, `second` varchar(255) NOT NULL, `unit_id` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined
    );
    await queryRunner.query(
      'CREATE TABLE `ebook` (`id` varchar(36) NOT NULL, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `title` varchar(255) NOT NULL, `content` longtext NOT NULL, `page_number` int NOT NULL, `unit_id` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined
    );
    await queryRunner.query(
      'CREATE TABLE `unit` (`id` varchar(36) NOT NULL, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `title` varchar(255) NOT NULL, `slug` varchar(255) NOT NULL, `type` varchar(255) NOT NULL, `description` text NULL, `exam_id` varchar(255) NULL, `content_id` varchar(255) NULL, `content_ids` text NULL, `track_id` varchar(255) NOT NULL, UNIQUE INDEX `IDX_492d3a34b8f91ef665e7e92dd3` (`slug`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined
    );
    await queryRunner.query(
      'CREATE TABLE `track` (`id` varchar(36) NOT NULL, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `title` varchar(255) NOT NULL, `slug` varchar(255) NOT NULL, `description` varchar(255) NOT NULL, `duration` int NULL DEFAULT 0, `index_units` text NULL, `class_id` varchar(255) NOT NULL, UNIQUE INDEX `IDX_7dd339bc7de258e28edec0ab71` (`slug`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined
    );
    await queryRunner.query(
      'CREATE TABLE `class` (`id` varchar(36) NOT NULL, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `title` varchar(255) NOT NULL, `slug` varchar(255) NOT NULL, `description` text NULL, `term_and_condition` text NULL, `published` tinyint NOT NULL DEFAULT 0, `approved` tinyint NOT NULL DEFAULT 0, `premium` tinyint NOT NULL DEFAULT 0, `featured` tinyint NOT NULL DEFAULT 0, `featured_file_id` varchar(255) NULL, `preview_file_id` varchar(255) NULL, `user_id` varchar(255) NOT NULL, `publisher_id` varchar(255) NULL, `enrolled` int NOT NULL DEFAULT 0, `type` varchar(255) NOT NULL DEFAULT \'course\', `length` varchar(255) NULL, `effort` varchar(255) NULL, `meta` json NULL, `index_tracks` text NULL, `syllabus` text NULL, UNIQUE INDEX `IDX_2313024ad26de20566e56aefc7` (`slug`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined
    );
    await queryRunner.query(
      'ALTER TABLE `audio_track` ADD CONSTRAINT `FK_a1c4230aac5559dc5f241e90616` FOREIGN KEY (`unit_id`) REFERENCES `unit`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
      undefined
    );
    await queryRunner.query(
      'ALTER TABLE `ebook` ADD CONSTRAINT `FK_146981a01751795bdfcec63e0ef` FOREIGN KEY (`unit_id`) REFERENCES `unit`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
      undefined
    );
    await queryRunner.query(
      'ALTER TABLE `unit` ADD CONSTRAINT `FK_2bb7de7aa2d0147abce607842d4` FOREIGN KEY (`track_id`) REFERENCES `track`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
      undefined
    );
    await queryRunner.query(
      'ALTER TABLE `track` ADD CONSTRAINT `FK_ee07e6c344bb7c8b8886c56a1c0` FOREIGN KEY (`class_id`) REFERENCES `class`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE `track` DROP FOREIGN KEY `FK_ee07e6c344bb7c8b8886c56a1c0`',
      undefined
    );
    await queryRunner.query(
      'ALTER TABLE `unit` DROP FOREIGN KEY `FK_2bb7de7aa2d0147abce607842d4`',
      undefined
    );
    await queryRunner.query(
      'ALTER TABLE `ebook` DROP FOREIGN KEY `FK_146981a01751795bdfcec63e0ef`',
      undefined
    );
    await queryRunner.query(
      'ALTER TABLE `audio_track` DROP FOREIGN KEY `FK_a1c4230aac5559dc5f241e90616`',
      undefined
    );
    await queryRunner.query(
      'DROP INDEX `IDX_2313024ad26de20566e56aefc7` ON `class`',
      undefined
    );
    await queryRunner.query('DROP TABLE `class`', undefined);
    await queryRunner.query(
      'DROP INDEX `IDX_7dd339bc7de258e28edec0ab71` ON `track`',
      undefined
    );
    await queryRunner.query('DROP TABLE `track`', undefined);
    await queryRunner.query(
      'DROP INDEX `IDX_492d3a34b8f91ef665e7e92dd3` ON `unit`',
      undefined
    );
    await queryRunner.query('DROP TABLE `unit`', undefined);
    await queryRunner.query('DROP TABLE `ebook`', undefined);
    await queryRunner.query('DROP TABLE `audio_track`', undefined);
  }
}
