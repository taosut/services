import { MigrationInterface, QueryRunner } from 'typeorm';

export class initDb1570172957347 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'CREATE TABLE `bookmark` (`id` varchar(36) NOT NULL, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `user_id` varchar(255) NOT NULL, `class_id` varchar(255) NOT NULL, `track_id` varchar(255) NOT NULL, `unit_id` varchar(255) NOT NULL, `ebook_id` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('DROP TABLE `bookmark`', undefined);
  }
}
