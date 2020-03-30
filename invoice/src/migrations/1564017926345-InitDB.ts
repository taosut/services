import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDB1564017926345 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'CREATE TABLE `invoice` (`id` varchar(36) NOT NULL, `influencerReferralCodeId` varchar(255) NOT NULL, `userId` varchar(255) NOT NULL, `productId` varchar(255) NOT NULL, `number` varchar(255) NOT NULL, `description` varchar(255) NOT NULL, `amount` int NOT NULL DEFAULT 0, `discount` int NOT NULL DEFAULT 0, `tax` int NOT NULL DEFAULT 0, `totalAmount` int NOT NULL DEFAULT 0, `status` varchar(255) NOT NULL, `issuedAt` datetime NULL, `paidAt` datetime NULL, `reviewedAt` datetime NULL, `approvedAt` datetime NULL, `cancelledAt` datetime NULL, `createdAt` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('DROP TABLE `invoice`');
  }
}
