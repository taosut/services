import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDB1574049909140 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        // tslint:disable-next-line: max-line-length
        await queryRunner.query('CREATE TABLE `subscriptions` (`id` varchar(255) NOT NULL, `created_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `account_id` varchar(255) NOT NULL, `payment_id` varchar(255) NOT NULL, `start` datetime NULL, `expired` datetime NULL, `active` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (`id`)) ENGINE=InnoDB');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query('DROP TABLE `subscriptions`');
    }

}
