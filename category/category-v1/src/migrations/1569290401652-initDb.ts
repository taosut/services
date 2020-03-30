import { MigrationInterface, QueryRunner } from 'typeorm';

export class initDb1569290401652 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'CREATE TABLE `sub_category` (`id` varchar(36) NOT NULL, `createdAt` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `slug` varchar(255) NOT NULL, `name` varchar(200) NOT NULL, `description` text NULL, `image_id` varchar(255) NULL, `category_id` varchar(255) NOT NULL, UNIQUE INDEX `IDX_f08643eb6693235bd717a56835` (`slug`), UNIQUE INDEX `IDX_7745a7cea2687ee7b048f828c7` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined
    );
    await queryRunner.query(
      'CREATE TABLE `category` (`id` varchar(36) NOT NULL, `createdAt` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `slug` varchar(255) NOT NULL, `name` varchar(200) NOT NULL, `description` text NULL, `image_id` varchar(255) NULL, UNIQUE INDEX `IDX_cb73208f151aa71cdd78f662d7` (`slug`), UNIQUE INDEX `IDX_23c05c292c439d77b0de816b50` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined
    );
    await queryRunner.query(
      'ALTER TABLE `sub_category` ADD CONSTRAINT `FK_4ec8c495300259f2322760a39fa` FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE `sub_category` DROP FOREIGN KEY `FK_4ec8c495300259f2322760a39fa`',
      undefined
    );
    await queryRunner.query(
      'DROP INDEX `IDX_23c05c292c439d77b0de816b50` ON `category`',
      undefined
    );
    await queryRunner.query(
      'DROP INDEX `IDX_cb73208f151aa71cdd78f662d7` ON `category`',
      undefined
    );
    await queryRunner.query('DROP TABLE `category`', undefined);
    await queryRunner.query(
      'DROP INDEX `IDX_7745a7cea2687ee7b048f828c7` ON `sub_category`',
      undefined
    );
    await queryRunner.query(
      'DROP INDEX `IDX_f08643eb6693235bd717a56835` ON `sub_category`',
      undefined
    );
    await queryRunner.query('DROP TABLE `sub_category`', undefined);
  }
}
