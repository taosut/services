import { MigrationInterface, QueryRunner } from 'typeorm';

export class initDb1561362567784 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'CREATE TABLE `user` (`id` varchar(36) NOT NULL, `keycloakId` varchar(255) NULL, `nickName` varchar(255) NULL, `fullName` varchar(255) NOT NULL, `email` varchar(255) NOT NULL, `emailVerified` tinyint NOT NULL DEFAULT 0, `twitterAccount` varchar(255) NULL, `twitterEmail` varchar(255) NULL, `facebookAccount` varchar(255) NULL, `facebookEmail` varchar(255) NULL, `googleEmail` varchar(255) NULL, `gender` varchar(255) NULL, `address` varchar(255) NULL, `province` varchar(255) NULL, `district` varchar(255) NULL, `postalCode` varchar(255) NULL, `phoneNumber` varchar(255) NULL, `birthday` datetime NULL, `registrationStatus` varchar(255) NULL, `registrationDate` datetime NULL, `registrationIp` varchar(255) NULL, `activationKey` varchar(255) NULL, `lastVisited` varchar(255) NULL, `membershipStatus` varchar(255) NULL, `invoiceStatus` varchar(255) NULL, `isDeleted` tinyint NOT NULL DEFAULT 0, `signUpAt` datetime NULL, `signUpIp` varchar(255) NULL, `lastVisitAt` datetime NULL, `stage` varchar(255) NULL, `highschoolSpecializationGroup` varchar(255) NULL, `curriculum` varchar(255) NULL, `school` varchar(255) NULL, `class` varchar(255) NULL, `createdAt` datetime NULL, `updatedAt` datetime NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `membership` (`id` varchar(36) NOT NULL, `productId` varchar(255) NOT NULL, `productType` varchar(255) NOT NULL, `activatedAt` datetime NULL, `expiredAt` datetime NULL, `createdAt` datetime NOT NULL, `updatedAt` datetime NOT NULL, `isDeleted` tinyint NOT NULL DEFAULT 0, `status` varchar(255) NULL DEFAULT null, `userId` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'ALTER TABLE `membership` ADD CONSTRAINT `FK_eef2d9d9c70cd13bed868afedf4` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE `membership` DROP FOREIGN KEY `FK_eef2d9d9c70cd13bed868afedf4`'
    );
    await queryRunner.query('DROP TABLE `membership`');
    await queryRunner.query('DROP TABLE `user`');
  }
}
