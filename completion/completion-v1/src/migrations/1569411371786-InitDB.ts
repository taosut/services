import {MigrationInterface, QueryRunner} from 'typeorm';

export class InitDB1569411371786 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('CREATE TABLE `completions` (`id` varchar(255) NOT NULL, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `elapsed_time` int NOT NULL DEFAULT 0, `type` varchar(20) NOT NULL, `progress` varchar(20) NOT NULL, `score` varchar(20) NULL, `finished` tinyint NOT NULL DEFAULT 0, `user_id` varchar(255) NOT NULL, `class_id` varchar(255) NOT NULL, `track_id` varchar(255) NOT NULL, `unit_id` varchar(255) NOT NULL, `meta` json NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB', undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('DROP TABLE `completions`', undefined);
    }

}
