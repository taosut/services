import { MigrationInterface, QueryRunner } from 'typeorm';

export class initDb31567751572314 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE `learning_completion` ADD `lecture_progress` varchar(20) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `learning_completion` ADD `quiz_progress` varchar(20) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `learning_completion` ADD `quiz_score` varchar(20) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `learning_completion` ADD `quiz_rank` varchar(20) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `learning_completion` ADD `overall_rank` varchar(20) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `playlist_completion` ADD `lecture_progress` varchar(20) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `playlist_completion` ADD `quiz_progress` varchar(20) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `playlist_completion` ADD `quiz_score` varchar(20) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `playlist_completion` ADD `quiz_rank` varchar(20) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `playlist_completion` ADD `overall_rank` varchar(20) NOT NULL'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE `playlist_completion` DROP COLUMN `overall_rank`'
    );
    await queryRunner.query(
      'ALTER TABLE `playlist_completion` DROP COLUMN `quiz_rank`'
    );
    await queryRunner.query(
      'ALTER TABLE `playlist_completion` DROP COLUMN `quiz_score`'
    );
    await queryRunner.query(
      'ALTER TABLE `playlist_completion` DROP COLUMN `quiz_progress`'
    );
    await queryRunner.query(
      'ALTER TABLE `playlist_completion` DROP COLUMN `lecture_progress`'
    );
    await queryRunner.query(
      'ALTER TABLE `learning_completion` DROP COLUMN `overall_rank`'
    );
    await queryRunner.query(
      'ALTER TABLE `learning_completion` DROP COLUMN `quiz_rank`'
    );
    await queryRunner.query(
      'ALTER TABLE `learning_completion` DROP COLUMN `quiz_score`'
    );
    await queryRunner.query(
      'ALTER TABLE `learning_completion` DROP COLUMN `quiz_progress`'
    );
    await queryRunner.query(
      'ALTER TABLE `learning_completion` DROP COLUMN `lecture_progress`'
    );
  }
}
