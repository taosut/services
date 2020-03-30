import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from 'typeorm';

export class TrackCompletionMigration1560157774271 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        let table = await queryRunner.getTable('track_completions');
        if (!table) {
            await queryRunner.createTable(new Table({
                name: 'track_completions',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'uuid',
                    },
                    {
                        name: 'total_progress',
                        type: 'float',
                    },
                    {
                        name: 'lecture_progress',
                        type: 'float',
                    },
                    {
                        name: 'quiz_progress',
                        type: 'float',
                    },
                    {
                        name: 'quiz_score',
                        type: 'float',
                    },
                    {
                        name: 'quiz_rank',
                        type: 'int',
                        isNullable: true,
                    },
                    {
                        name: 'overall_rank',
                        type: 'int',
                        isNullable: true,
                    },
                    {
                        name: 'finished',
                        type: 'boolean',
                        default: false,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamptz',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamptz',
                        default: 'CURRENT_TIMESTAMP',
                        onUpdate: 'CURRENT_TIMESTAMP',
                    },
                ],
            }), true);
        }

        table = await queryRunner.getTable('track_completions');
        let isColumnExist = await table.findColumnByName('track_id');
        if (!isColumnExist) {
            await queryRunner.addColumn('track_completions', new TableColumn
            ({
                name: 'track_id',
                type: 'uuid',
            }));

            await queryRunner.createForeignKey('track_completions', new TableForeignKey({
                columnNames: ['track_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'tracks',
                onDelete: 'CASCADE',
            }));
        }

        isColumnExist = await table.findColumnByName('user_id');
        if (!isColumnExist) {
            await queryRunner.addColumn('track_completions', new TableColumn({
                name: 'user_id',
                type: 'uuid',
                isNullable: true,
            }));
        }

        console.info('MIGRATION - TrackCompletionMigration - Success');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const table = await queryRunner.getTable('track_completions');
        const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('track_id') !== -1);
        await queryRunner.dropForeignKey('track_completions', foreignKey);
        await queryRunner.dropColumn('track_completions', 'track_id');

        await queryRunner.dropColumn('track_completions', 'user_id');

        await queryRunner.dropTable('track_completions');

        console.info('REVERT MIGRATION - TrackCompletionMigration - Success');
    }

}
