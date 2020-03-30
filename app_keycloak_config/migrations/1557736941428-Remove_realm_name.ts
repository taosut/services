import {MigrationInterface, QueryRunner} from "typeorm";

export class RemoveRealmName1557736941428 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `keycloak_realm` DROP COLUMN `name`");
        await queryRunner.query("ALTER TABLE `keycloak_realm` ADD UNIQUE INDEX `IDX_b8f9619521e1826d464447bb43` (`realm`)");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `keycloak_realm` DROP INDEX `IDX_b8f9619521e1826d464447bb43`");
        await queryRunner.query("ALTER TABLE `keycloak_realm` ADD `name` varchar(255) NOT NULL");
    }

}
