import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from 'typeorm';

export class FinalExamAttemptDetailMigration1562570383168 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        let table = await queryRunner.getTable('final_exam_attempt_details');
        if (!table) {
            await queryRunner.createTable(new Table({
                name: 'final_exam_attempt_details',
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
                        isNullable: true,
                    },
                    {
                        name: 'sort_order',
                        type: 'int',
                        isNullable: true,
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

        table = await queryRunner.getTable('final_exam_attempt_details');
        let isColumnExist = await table.findColumnByName('question_id');
        if (!isColumnExist) {
            await queryRunner.addColumn('final_exam_attempt_details', new TableColumn({
                name: 'question_id',
                type: 'uuid',
            }));

            await queryRunner.createForeignKey('final_exam_attempt_details', new TableForeignKey({
                columnNames: ['question_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'final_exam_questions',
                onDelete: 'CASCADE',
            }));
        }

        isColumnExist = await table.findColumnByName('choosen_answer_id');
        if (!isColumnExist) {
            await queryRunner.addColumn('final_exam_attempt_details', new TableColumn({
                name: 'choosen_answer_id',
                type: 'uuid',
                isNullable: true,
            }));

            await queryRunner.createForeignKey('final_exam_attempt_details', new TableForeignKey({
                columnNames: ['choosen_answer_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'final_exam_answers',
                onDelete: 'CASCADE',
            }));
        }

        isColumnExist = await table.findColumnByName('correct_answer_id');
        if (!isColumnExist) {
            await queryRunner.addColumn('final_exam_attempt_details', new TableColumn({
                name: 'correct_answer_id',
                type: 'uuid',
                isNullable: true,
            }));

            await queryRunner.createForeignKey('final_exam_attempt_details', new TableForeignKey({
                columnNames: ['correct_answer_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'final_exam_answers',
                onDelete: 'CASCADE',
            }));
        }

        isColumnExist = await table.findColumnByName('attempt_id');
        if (!isColumnExist) {
            await queryRunner.addColumn('final_exam_attempt_details', new TableColumn({
                name: 'attempt_id',
                type: 'uuid',
                isNullable: true,
            }));

            await queryRunner.createForeignKey('final_exam_attempt_details', new TableForeignKey({
                columnNames: ['attempt_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'final_exam_attempts',
                onDelete: 'CASCADE',
            }));
        }

        console.info('MIGRATION - QuizAttemptDetailMigration - Success');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const table = await queryRunner.getTable('final_exam_attempt_details');
        let foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('question_id') !== -1);
        await queryRunner.dropForeignKey('final_exam_attempt_details', foreignKey);
        await queryRunner.dropColumn('final_exam_attempt_details', 'question_id');

        foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('choosen_answer_id') !== -1);
        await queryRunner.dropForeignKey('final_exam_attempt_details', foreignKey);
        await queryRunner.dropColumn('final_exam_attempt_details', 'choosen_answer_id');

        foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('correct_answer_id') !== -1);
        await queryRunner.dropForeignKey('final_exam_attempt_details', foreignKey);
        await queryRunner.dropColumn('final_exam_attempt_details', 'correct_answer_id');

        foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('attempt_id') !== -1);
        await queryRunner.dropForeignKey('final_exam_attempt_details', foreignKey);
        await queryRunner.dropColumn('final_exam_attempt_details', 'attempt_id');

        await queryRunner.dropTable('final_exam_attempt_details');

        console.info('REVERT MIGRATION - QuizAttemptDetailMigration - Success');
    }

}
