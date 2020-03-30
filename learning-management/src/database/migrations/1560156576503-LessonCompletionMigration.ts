import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from 'typeorm';

export class LessonCompletionMigration1560156576503 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        let table = await queryRunner.getTable('lesson_completions');
        if (!table) {
            await queryRunner.createTable(new Table({
                name: 'lesson_completions',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'uuid',
                    },
                    {
                        name: 'elapsed_time',
                        type: 'int',
                    },
                    {
                        name: 'progress',
                        type: 'float',
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

        table = await queryRunner.getTable('lesson_completions');
        let isColumnExist = await table.findColumnByName('lesson_id');
        if (!isColumnExist) {
            await queryRunner.addColumn('lesson_completions', new TableColumn({
                name: 'lesson_id',
                type: 'uuid',
            }));

            await queryRunner.createForeignKey('lesson_completions', new TableForeignKey({
                columnNames: ['lesson_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'lessons',
                onDelete: 'CASCADE',
            }));
        }

        isColumnExist = await table.findColumnByName('user_id');
        if (!isColumnExist) {
            await queryRunner.addColumn('lesson_completions', new TableColumn({
                name: 'user_id',
                type: 'uuid',
                isNullable: true,
            }));
        }

        console.info('MIGRATION - LessonCompletionMigration - Success');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const table = await queryRunner.getTable('lesson_completions');
        const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('lesson_id') !== -1);
        await queryRunner.dropForeignKey('lesson_completions', foreignKey);
        await queryRunner.dropColumn('lesson_completions', 'lesson_id');

        await queryRunner.dropColumn('lesson_completions', 'user_id');

        await queryRunner.dropTable('lesson_completions');

        console.info('REVERT MIGRATION - LessonCompletionMigration - Success');
    }

}
