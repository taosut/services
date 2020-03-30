import {MigrationInterface, QueryRunner} from "typeorm";

export class initDb21564633379128 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `content` (`id` varchar(36) NOT NULL, `createdAt` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, `size` int NOT NULL, `path` varchar(255) NOT NULL, `realm` varchar(255) NOT NULL, `ownership` varchar(255) NOT NULL, `fileType` varchar(255) NOT NULL, `uploadedBy` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP TABLE `content`");
    }

}
