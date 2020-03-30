import {MigrationInterface, QueryRunner} from "typeorm";

export class InitPayment1561546502902 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `payment` (`id` varchar(36) NOT NULL, `invoiceId` varchar(255) NOT NULL, `paymentNumber` varchar(255) NOT NULL, `userId` varchar(255) NOT NULL, `paymentAmount` int NOT NULL, `paymentMethod` varchar(255) NOT NULL, `bankTransferType` varchar(255) NULL, `transactionDocument` varchar(255) NULL, `gopayCallbackUrl` varchar(255) NULL, `midtransTransactionId` varchar(255) NULL, `midtransTransactionTime` varchar(255) NULL, `midtransStatus` varchar(255) NULL, `status` varchar(255) NOT NULL, `vaNumber` varchar(255) NULL, `billerCode` varchar(255) NULL, `billKey` varchar(255) NULL, `gopayAction` varchar(255) NULL, `storeName` varchar(255) NULL, `message` varchar(255) NULL, `cStorePaymentCode` varchar(255) NULL, `grossAmount` varchar(255) NULL, `statusUpdatedAt` datetime NULL, `createdAt` datetime NOT NULL, `updatedAt` datetime NULL, UNIQUE INDEX `IDX_2e7062ca78b0ad03bd1112a934` (`midtransTransactionId`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP INDEX `IDX_2e7062ca78b0ad03bd1112a934` ON `payment`");
        await queryRunner.query("DROP TABLE `payment`");
    }

}
