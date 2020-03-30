import { MigrationInterface, QueryRunner } from 'typeorm';

export class initDb1565353553145 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'CREATE TABLE `audio_playlist` (`id` varchar(36) NOT NULL, `createdAt` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `title` varchar(255) NOT NULL, `time` varchar(255) NOT NULL, `minute` varchar(255) NOT NULL, `second` varchar(255) NOT NULL, `lessonId` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `ebook` (`id` varchar(36) NOT NULL, `createdAt` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `title` varchar(255) NOT NULL, `content` text NOT NULL, `pageNumber` int NOT NULL, `lessonId` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `lesson` (`id` varchar(36) NOT NULL, `createdAt` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `title` varchar(255) NOT NULL, `slug` varchar(255) NOT NULL, `type` varchar(255) NOT NULL, `description` varchar(255) NULL, `examId` varchar(255) NULL, `contentId` varchar(255) NULL, `playlistId` varchar(255) NOT NULL, UNIQUE INDEX `IDX_db1819e1834a90ab442530d7c2` (`slug`), PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `playlist` (`id` varchar(36) NOT NULL, `createdAt` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `title` varchar(255) NOT NULL, `slug` varchar(255) NOT NULL, `description` varchar(255) NOT NULL, `duration` int NULL DEFAULT 0, `indexLessons` text NULL, `learningId` varchar(255) NOT NULL, UNIQUE INDEX `IDX_d5a7c6faf045dc58324c8409c4` (`slug`), PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `learning` (`id` varchar(36) NOT NULL, `createdAt` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `title` varchar(255) NOT NULL, `slug` varchar(255) NOT NULL, `description` text NULL, `termAndCondition` text NULL, `published` tinyint NOT NULL DEFAULT 0, `approved` tinyint NOT NULL DEFAULT 0, `premium` tinyint NOT NULL DEFAULT 0, `featuredFileId` varchar(255) NULL, `previewFileId` varchar(255) NULL, `userId` varchar(255) NULL, `trackId` varchar(255) NULL, `subCategoryId` varchar(255) NULL, `publisherId` varchar(255) NULL, `enrolledNumber` int NOT NULL DEFAULT 0, `type` varchar(255) NOT NULL DEFAULT \'Course\', `length` varchar(255) NULL, `effort` varchar(255) NULL, `indexPlaylists` text NULL, UNIQUE INDEX `IDX_6a5a8c548daa290139074bb7ec` (`slug`), PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'ALTER TABLE `audio_playlist` ADD CONSTRAINT `FK_933e1b6c21dc4211deca85451b4` FOREIGN KEY (`lessonId`) REFERENCES `lesson`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `ebook` ADD CONSTRAINT `FK_eaef9cd319ddc6417be3afddbd4` FOREIGN KEY (`lessonId`) REFERENCES `lesson`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `lesson` ADD CONSTRAINT `FK_353d9f7b39ba5c348ee474532e4` FOREIGN KEY (`playlistId`) REFERENCES `playlist`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `playlist` ADD CONSTRAINT `FK_0eb79bd5583c201c5bc1dca1bfb` FOREIGN KEY (`learningId`) REFERENCES `learning`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE `playlist` DROP FOREIGN KEY `FK_0eb79bd5583c201c5bc1dca1bfb`'
    );
    await queryRunner.query(
      'ALTER TABLE `lesson` DROP FOREIGN KEY `FK_353d9f7b39ba5c348ee474532e4`'
    );
    await queryRunner.query(
      'ALTER TABLE `ebook` DROP FOREIGN KEY `FK_eaef9cd319ddc6417be3afddbd4`'
    );
    await queryRunner.query(
      'ALTER TABLE `audio_playlist` DROP FOREIGN KEY `FK_933e1b6c21dc4211deca85451b4`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_6a5a8c548daa290139074bb7ec` ON `learning`'
    );
    await queryRunner.query('DROP TABLE `learning`');
    await queryRunner.query(
      'DROP INDEX `IDX_d5a7c6faf045dc58324c8409c4` ON `playlist`'
    );
    await queryRunner.query('DROP TABLE `playlist`');
    await queryRunner.query(
      'DROP INDEX `IDX_db1819e1834a90ab442530d7c2` ON `lesson`'
    );
    await queryRunner.query('DROP TABLE `lesson`');
    await queryRunner.query('DROP TABLE `ebook`');
    await queryRunner.query('DROP TABLE `audio_playlist`');
  }
}
