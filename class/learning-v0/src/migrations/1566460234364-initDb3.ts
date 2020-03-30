import {MigrationInterface, QueryRunner} from "typeorm";

export class initDb31566460234364 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `lesson` ADD `contentIds` text NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `lesson` DROP COLUMN `contentIds`");
    }

}
