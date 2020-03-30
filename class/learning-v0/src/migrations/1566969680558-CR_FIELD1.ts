import {MigrationInterface, QueryRunner} from "typeorm";

export class CRFIELD11566969680558 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `ebook` DROP COLUMN `content`");
        await queryRunner.query("ALTER TABLE `ebook` ADD `content` longtext NOT NULL");
        await queryRunner.query("ALTER TABLE `lesson` DROP COLUMN `description`");
        await queryRunner.query("ALTER TABLE `lesson` ADD `description` longtext NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `lesson` DROP COLUMN `description`");
        await queryRunner.query("ALTER TABLE `lesson` ADD `description` text NULL");
        await queryRunner.query("ALTER TABLE `ebook` DROP COLUMN `content`");
        await queryRunner.query("ALTER TABLE `ebook` ADD `content` text NOT NULL");
    }

}
