import {MigrationInterface, QueryRunner} from "typeorm";

export class AddColumnUrlToCertificate1570869837632 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `certificates` ADD `url` varchar(255) NULL", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `certificates` DROP COLUMN `url`", undefined);
    }

}
