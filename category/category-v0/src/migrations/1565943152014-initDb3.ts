import {MigrationInterface, QueryRunner} from "typeorm";

export class initDb31565943152014 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `sub_category` DROP FOREIGN KEY `FK_51b8c0b349725210c4bd8b9b7a7`");
        await queryRunner.query("ALTER TABLE `sub_category` ADD CONSTRAINT `FK_51b8c0b349725210c4bd8b9b7a7` FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `sub_category` DROP FOREIGN KEY `FK_51b8c0b349725210c4bd8b9b7a7`");
        await queryRunner.query("ALTER TABLE `sub_category` ADD CONSTRAINT `FK_51b8c0b349725210c4bd8b9b7a7` FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
    }

}
