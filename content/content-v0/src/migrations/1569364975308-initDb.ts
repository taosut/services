import { MigrationInterface, QueryRunner } from 'typeorm';

export class initDb1569364975308 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'CREATE TABLE `content` (`id` varchar(36) NOT NULL, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, `size` int NOT NULL, `path` varchar(255) NOT NULL, `realm` varchar(255) NOT NULL, `ownership` varchar(255) NOT NULL, `fileType` varchar(255) NOT NULL, `uploadedBy` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('DROP TABLE `content`', undefined);
  }
}
