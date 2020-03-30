import {MigrationInterface, QueryRunner} from "typeorm";

export class CRFieldLearning021567570613387 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `learning` ADD `syllabus` text NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `learning` DROP COLUMN `syllabus`");
    }

}
