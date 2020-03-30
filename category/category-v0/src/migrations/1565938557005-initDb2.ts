import {MigrationInterface, QueryRunner} from "typeorm";

export class initDb21565938557005 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `sub_category` (`id` varchar(36) NOT NULL, `createdAt` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `slug` varchar(255) NOT NULL, `name` varchar(200) NOT NULL, `description` text NULL, `previewFileId` varchar(255) NULL, `categoryId` varchar(255) NOT NULL, UNIQUE INDEX `IDX_f08643eb6693235bd717a56835` (`slug`), UNIQUE INDEX `IDX_7745a7cea2687ee7b048f828c7` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `category` (`id` varchar(36) NOT NULL, `createdAt` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `slug` varchar(255) NOT NULL, `name` varchar(200) NOT NULL, `description` text NULL, `previewFileId` varchar(255) NULL, UNIQUE INDEX `IDX_cb73208f151aa71cdd78f662d7` (`slug`), UNIQUE INDEX `IDX_23c05c292c439d77b0de816b50` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `sub_category` ADD CONSTRAINT `FK_51b8c0b349725210c4bd8b9b7a7` FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `sub_category` DROP FOREIGN KEY `FK_51b8c0b349725210c4bd8b9b7a7`");
        await queryRunner.query("DROP INDEX `IDX_23c05c292c439d77b0de816b50` ON `category`");
        await queryRunner.query("DROP INDEX `IDX_cb73208f151aa71cdd78f662d7` ON `category`");
        await queryRunner.query("DROP TABLE `category`");
        await queryRunner.query("DROP INDEX `IDX_7745a7cea2687ee7b048f828c7` ON `sub_category`");
        await queryRunner.query("DROP INDEX `IDX_f08643eb6693235bd717a56835` ON `sub_category`");
        await queryRunner.query("DROP TABLE `sub_category`");
    }

}
