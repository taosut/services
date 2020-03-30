import { MigrationInterface, QueryRunner } from 'typeorm';

export class initDb1569998666928 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE `unit` DROP FOREIGN KEY `FK_2bb7de7aa2d0147abce607842d4`',
      undefined
    );
    await queryRunner.query(
      'ALTER TABLE `unit` DROP COLUMN `exam_id`',
      undefined
    );
    await queryRunner.query(
      'ALTER TABLE `unit` ADD CONSTRAINT `FK_2bb7de7aa2d0147abce607842d4` FOREIGN KEY (`track_id`) REFERENCES `track`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE `unit` DROP FOREIGN KEY `FK_2bb7de7aa2d0147abce607842d4`',
      undefined
    );
    await queryRunner.query(
      'ALTER TABLE `unit` ADD `exam_id` varchar(255) NULL',
      undefined
    );
    await queryRunner.query(
      'ALTER TABLE `unit` ADD CONSTRAINT `FK_2bb7de7aa2d0147abce607842d4` FOREIGN KEY (`track_id`) REFERENCES `track`(`id`) ON DELETE CASCADE ON UPDATE CASCADE',
      undefined
    );
  }
}
