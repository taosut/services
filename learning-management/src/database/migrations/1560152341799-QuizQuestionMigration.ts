import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from 'typeorm';

export class QuizQuestionMigration1560152341799 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        let table = await queryRunner.getTable('quiz_questions');
        if (!table) {
            await queryRunner.createTable(new Table({
                name: 'quiz_questions',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'uuid',
                    },
                    {
                        name: 'question',
                        type: 'text',
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
                    {
                        name: 'deleted_at',
                        type: 'timestamptz',
                        isNullable: true,
                    },
                ],
            }), true);
        }

        table = await queryRunner.getTable('quiz_questions');
        const isColumnExist = await table.findColumnByName('quiz_id');
        if (!isColumnExist) {
            await queryRunner.addColumn('quiz_questions', new TableColumn({
                name: 'quiz_id',
                type: 'uuid',
            }));

            await queryRunner.createForeignKey('quiz_questions', new TableForeignKey({
                columnNames: ['quiz_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'lessons',
                onDelete: 'CASCADE',
            }));
        }

        console.info('MIGRATION - QuizQuestionMigration - Success');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const table = await queryRunner.getTable('quiz_questions');
        const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('quiz_id') !== -1);
        await queryRunner.dropForeignKey('quiz_questions', foreignKey);
        await queryRunner.dropColumn('quiz_questions', 'quiz_id');

        await queryRunner.dropTable('quiz_questions');

        console.info('REVERT MIGRATION - QuizQuestionMigration - Success');
    }

}
