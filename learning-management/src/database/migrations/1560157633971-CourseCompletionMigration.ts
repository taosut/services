import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from 'typeorm';

export class CourseCompletionMigration1560157633971 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        let table = await queryRunner.getTable('course_completions');
        if (!table) {
            await queryRunner.createTable(new Table({
                name: 'course_completions',
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

        table = await queryRunner.getTable('course_completions');
        let isColumnExist = await table.findColumnByName('course_id');
        if (!isColumnExist) {
            await queryRunner.addColumn('course_completions', new TableColumn
            ({
                name: 'course_id',
                type: 'uuid',
            }));

            await queryRunner.createForeignKey('course_completions', new TableForeignKey({
                columnNames: ['course_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'courses',
                onDelete: 'CASCADE',
            }));
        }

        isColumnExist = await table.findColumnByName('user_id');
        if (!isColumnExist) {
            await queryRunner.addColumn('course_completions', new TableColumn({
                name: 'user_id',
                type: 'uuid',
                isNullable: true,
            }));
        }

        console.info('MIGRATION - CourseCompletionMigration - Success');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const table = await queryRunner.getTable('course_completions');
        const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('course_id') !== -1);
        await queryRunner.dropForeignKey('course_completions', foreignKey);
        await queryRunner.dropColumn('course_completions', 'course_id');

        await queryRunner.dropColumn('course_completions', 'user_id');

        await queryRunner.dropTable('course_completions');

        console.info('REVERT MIGRATION - CourseCompletionMigration - Success');
    }

}
