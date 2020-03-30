import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from 'typeorm';

export class FinalExamAnswerMigration1562554312014 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        let table = await queryRunner.getTable('final_exam_answers');
        if (!table) {
            await queryRunner.createTable(new Table({
                name: 'final_exam_answers',
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

        table = await queryRunner.getTable('final_exam_answers');
        const isColumnExist = await table.findColumnByName('question_id');
        if (!isColumnExist) {
            await queryRunner.addColumn('final_exam_answers', new TableColumn({
                name: 'question_id',
                type: 'uuid',
            }));

            await queryRunner.createForeignKey('final_exam_answers', new TableForeignKey({
                columnNames: ['question_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'final_exam_questions',
                onDelete: 'CASCADE',
            }));
        }

        console.info('MIGRATION - FinalExamAnswerMigration - Success');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const table = await queryRunner.getTable('final_exam_answers');
        const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('question_id') !== -1);
        await queryRunner.dropForeignKey('final_exam_answers', foreignKey);
        await queryRunner.dropColumn('final_exam_answers', 'question_id');

        await queryRunner.dropTable('final_exam_answers');

        console.info('REVERT MIGRATION - FinalExamAnswerMigration - Success');
    }

}
