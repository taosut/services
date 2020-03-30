import { MigrationInterface, QueryRunner } from 'typeorm';

export class Profile1568374689344 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'CREATE TABLE `profiles` (`id` varchar(255) NOT NULL, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `account_id` varchar(255) NULL, `group` varchar(255) NULL, `position` varchar(255) NULL, `address` text NULL, `province` varchar(255) NULL, `city` varchar(255) NULL, `sub_district` varchar(255) NULL, `education` varchar(255) NULL, `phone_number` varchar(255) NULL, `photo_id` varchar(255) NULL, UNIQUE INDEX `IDX_48f07a756b8f321aa99b06aee1` (`account_id`), PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'DROP INDEX `IDX_48f07a756b8f321aa99b06aee1` ON `profiles`'
    );
    await queryRunner.query('DROP TABLE `profiles`');
  }
}
