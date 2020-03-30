import {MigrationInterface, QueryRunner} from "typeorm";

export class initDb21565145644006 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `content` CHANGE `size` `size` int NOT NULL DEFAULT 0");
        await queryRunner.query("ALTER TABLE `content` CHANGE `path` `path` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `content` CHANGE `fileType` `fileType` varchar(255) NOT NULL DEFAULT 'image/png'");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `content` CHANGE `fileType` `fileType` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `content` CHANGE `path` `path` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `content` CHANGE `size` `size` int NOT NULL");
    }

}
