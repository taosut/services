import {MigrationInterface, QueryRunner} from "typeorm";

export class InitDB1557722686587 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `keycloak_realm` (`id` varchar(36) NOT NULL, `name` varchar(255) NOT NULL, `realm` varchar(255) NOT NULL, `resource` varchar(255) NOT NULL, `authServerUrl` varchar(255) NOT NULL, `public` tinyint NOT NULL DEFAULT 1, PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP TABLE `keycloak_realm`");
    }

}
