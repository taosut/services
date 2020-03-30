import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from 'typeorm';

export class FinalExamQuestionMigration1562554170023 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        let table = await queryRunner.getTable('final_exam_questions');
        if (!table) {
            await queryRunner.createTable(new Table({
                name: 'final_exam_questions',
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

        table = await queryRunner.getTable('final_exam_questions');
        const isColumnExist = await table.findColumnByName('final_exam_id');
        if (!isColumnExist) {
            await queryRunner.addColumn('final_exam_questions', new TableColumn({
                name: 'final_exam_id',
                type: 'uuid',
            }));

            await queryRunner.createForeignKey('final_exam_questions', new TableForeignKey({
                columnNames: ['final_exam_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'final_exams',
                onDelete: 'CASCADE',
            }));
        }

        console.info('MIGRATION - FinalExamQuestionMigration - Success');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const table = await queryRunner.getTable('final_exam_questions');
        const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('final_exam_id') !== -1);
        await queryRunner.dropForeignKey('final_exam_questions', foreignKey);
        await queryRunner.dropColumn('final_exam_questions', 'final_exam_id');

        await queryRunner.dropTable('final_exam_questions');

        console.info('REVERT MIGRATION - FinalExamQuestionMigration - Success');
    }

}
