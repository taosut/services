import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDB1568607980040 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'CREATE TABLE `class_members` (`id` varchar(255) NOT NULL, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `class_id` varchar(255) NOT NULL, `user_id` varchar(255) NOT NULL, `has_joined` tinyint NOT NULL DEFAULT 0, `start` datetime NULL, `expired` datetime NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('DROP TABLE `class_members`');
  }
}
