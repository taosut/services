import { MigrationInterface, QueryRunner } from 'typeorm';

export class initDb1569893446186 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'CREATE TABLE `event` (`id` varchar(36) NOT NULL, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `start_at` datetime NULL, `end_at` datetime NULL, `title` text NOT NULL, `description` text NOT NULL, `published` tinyint NOT NULL DEFAULT 0, `user_id` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('DROP TABLE `event`', undefined);
  }
}
