import { MigrationInterface, QueryRunner } from 'typeorm';

export class initDb1567058224662 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'CREATE TABLE `learning_completion` (`id` varchar(36) NOT NULL, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `elapsed_time` int NOT NULL DEFAULT 0, `progress` varchar(20) NOT NULL, `finished` tinyint NOT NULL DEFAULT 0, `user_id` varchar(255) NOT NULL, `learning_id` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `lesson_completion` (`id` varchar(36) NOT NULL, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `elapsed_time` int NOT NULL DEFAULT 0, `progress` varchar(20) NOT NULL, `finished` tinyint NOT NULL DEFAULT 0, `user_id` varchar(255) NOT NULL, `lesson_id` varchar(255) NOT NULL, `playlist_id` varchar(255) NOT NULL, `learning_id` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `playlist_completion` (`id` varchar(36) NOT NULL, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `elapsed_time` int NOT NULL DEFAULT 0, `progress` varchar(20) NOT NULL, `finished` tinyint NOT NULL DEFAULT 0, `user_id` varchar(255) NOT NULL, `playlist_id` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `track_completion` (`id` varchar(36) NOT NULL, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `elapsed_time` int NOT NULL DEFAULT 0, `progress` varchar(20) NOT NULL, `finished` tinyint NOT NULL DEFAULT 0, `user_id` varchar(255) NULL, `track_id` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('DROP TABLE `track_completion`');
    await queryRunner.query('DROP TABLE `playlist_completion`');
    await queryRunner.query('DROP TABLE `lesson_completion`');
    await queryRunner.query('DROP TABLE `learning_completion`');
  }
}
