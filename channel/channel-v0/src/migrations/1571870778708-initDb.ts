import {MigrationInterface, QueryRunner} from "typeorm";

export class initDb1571870778708 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `channel` (`id` varchar(36) NOT NULL, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `slug` varchar(255) NOT NULL, `name` varchar(200) NOT NULL, `description` text NULL, `short_description` text NULL, `meta` json NULL, `logo` varchar(255) NULL, UNIQUE INDEX `IDX_8479b8802f0cd5d60c61a5ad20` (`slug`), UNIQUE INDEX `IDX_800e6da7e4c30fbb0653ba7bb6` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `account` (`id` varchar(36) NOT NULL, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `account_id` varchar(255) NOT NULL, `channel_id` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("ALTER TABLE `account` ADD CONSTRAINT `FK_b041ebb34817c4855b975417e8e` FOREIGN KEY (`channel_id`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `account` DROP FOREIGN KEY `FK_b041ebb34817c4855b975417e8e`", undefined);
        await queryRunner.query("DROP TABLE `account`", undefined);
        await queryRunner.query("DROP INDEX `IDX_800e6da7e4c30fbb0653ba7bb6` ON `channel`", undefined);
        await queryRunner.query("DROP INDEX `IDX_8479b8802f0cd5d60c61a5ad20` ON `channel`", undefined);
        await queryRunner.query("DROP TABLE `channel`", undefined);
    }

}
