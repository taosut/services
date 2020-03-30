import {MigrationInterface, QueryRunner} from "typeorm";

export class CRFieldLearning1567506339417 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `learning` ADD `featured` tinyint NOT NULL DEFAULT 0");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `learning` DROP COLUMN `featured`");
    }

}
