import {MigrationInterface, QueryRunner} from "typeorm";

export class initDb21566365098959 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `lesson` DROP COLUMN `description`");
        await queryRunner.query("ALTER TABLE `lesson` ADD `description` text NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `lesson` DROP COLUMN `description`");
        await queryRunner.query("ALTER TABLE `lesson` ADD `description` varchar(255) NULL");
    }

}
