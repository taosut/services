import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from 'typeorm';

export class QuizAnswerMigration1560154367377 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        let table = await queryRunner.getTable('quiz_answers');
        if (!table) {
            await queryRunner.createTable(new Table({
                name: 'quiz_answers',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'uuid',
                    },
                    {
                        name: 'answer',
                        type: 'text',
                    },
                    {
                        name: 'correct',
                        type: 'boolean',
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

        table = await queryRunner.getTable('quiz_answers');
        const isColumnExist = await table.findColumnByName('question_id');
        if (!isColumnExist) {
            await queryRunner.addColumn('quiz_answers', new TableColumn({
                name: 'question_id',
                type: 'uuid',
            }));

            await queryRunner.createForeignKey('quiz_answers', new TableForeignKey({
                columnNames: ['question_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'quiz_questions',
                onDelete: 'CASCADE',
            }));
        }

        console.info('MIGRATION - QuizAnswerMigration - Success');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const table = await queryRunner.getTable('quiz_answers');
        const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('question_id') !== -1);
        await queryRunner.dropForeignKey('quiz_answers', foreignKey);
        await queryRunner.dropColumn('quiz_answers', 'question_id');

        await queryRunner.dropTable('quiz_answers');

        console.info('REVERT MIGRATION - QuizAnswerMigration - Success');
    }

}
