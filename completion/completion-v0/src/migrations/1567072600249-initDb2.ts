import { MigrationInterface, QueryRunner } from 'typeorm';

export class initDb21567072600249 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE `playlist_completion` ADD `learning_id` varchar(255) NOT NULL'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE `playlist_completion` DROP COLUMN `learning_id`'
    );
  }
}
