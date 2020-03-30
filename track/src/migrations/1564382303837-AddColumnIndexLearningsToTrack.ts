import {MigrationInterface, QueryRunner, TableColumn} from 'typeorm';

export class AddColumnIndexLearningsToTrack1564382303837 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const table = await queryRunner.getTable('tracks');
        const isColumnExist = await table.findColumnByName('indexLearnings');
        if (!isColumnExist) {
            await queryRunner.addColumn('tracks', new TableColumn({
                name: 'indexLearnings',
                type: 'text',
                isNullable: true,
            }));
        }
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn('tracks', 'indexLearnings');
    }

}
