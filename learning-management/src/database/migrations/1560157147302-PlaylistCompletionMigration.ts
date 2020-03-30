import {MigrationInterface, QueryRunner, Table, TableForeignKey, TableColumn} from 'typeorm';

export class PlaylistCompletionMigration1560157147302 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        let table = await queryRunner.getTable('playlist_completions');
        if (!table) {
            await queryRunner.createTable(new Table({
                name: 'playlist_completions',
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
                        default: 0,
                    },
                    {
                        name: 'lecture_progress',
                        type: 'float',
                        default: 0,
                    },
                    {
                        name: 'quiz_progress',
                        type: 'float',
                        default: 0,
                    },
                    {
                        name: 'quiz_score',
                        type: 'float',
                        default: 0,
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

        table = await queryRunner.getTable('playlist_completions');
        let isColumnExist = await table.findColumnByName('playlist_id');
        if (!isColumnExist) {
            await queryRunner.addColumn('playlist_completions', new TableColumn
            ({
                name: 'playlist_id',
                type: 'uuid',
            }));

            await queryRunner.createForeignKey('playlist_completions', new TableForeignKey({
                columnNames: ['playlist_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'playlists',
                onDelete: 'CASCADE',
            }));
        }

        isColumnExist = await table.findColumnByName('user_id');
        if (!isColumnExist) {
            await queryRunner.addColumn('playlist_completions', new TableColumn({
                name: 'user_id',
                type: 'uuid',
                isNullable: true,
            }));
        }

        console.info('MIGRATION - PlaylistCompletionMigration - Success');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const table = await queryRunner.getTable('playlist_completions');
        const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('playlist_id') !== -1);
        await queryRunner.dropForeignKey('playlist_completions', foreignKey);
        await queryRunner.dropColumn('playlist_completions', 'playlist_id');

        await queryRunner.dropColumn('playlist_completions', 'user_id');

        await queryRunner.dropTable('playlist_completions');

        console.info('REVERT MIGRATION - PlaylistCompletionMigration - Success');
    }

}
