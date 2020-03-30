import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from 'typeorm';

export class FinalExamAttemptMigration1562570262897 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        let table = await queryRunner.getTable('final_exam_attempts');
        if (!table) {
            await queryRunner.createTable(new Table({
                name: 'final_exam_attempts',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'uuid',
                    },
                    {
                        name: 'total_attempted',
                        type: 'int',
                        default: 1,
                    },
                    {
                        name: 'total_correct',
                        type: 'int',
                        isNullable: true,
                    },
                    {
                        name: 'total_question',
                        type: 'int',
                        isNullable: true,
                    },
                    {
                        name: 'latest_score',
                        type: 'float',
                        isNullable: true,
                    },
                    {
                        name: 'elapsed_time',
                        type: 'int',
                        isNullable: true,
                    },
                    {
                        name: 'finished',
                        type: 'boolean',
                        default: false,
                    },
                    {
                        name: 'latest_started_at',
                        type: 'timestamptz',
                        default: 'CURRENT_TIMESTAMP',
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

        table = await queryRunner.getTable('final_exam_attempts');
        let isColumnExist = await table.findColumnByName('final_exam_id');
        if (!isColumnExist) {
            await queryRunner.addColumn('final_exam_attempts', new TableColumn({
                name: 'final_exam_id',
                type: 'uuid',
            }));

            await queryRunner.createForeignKey('final_exam_attempts', new TableForeignKey({
                columnNames: ['final_exam_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'final_exams',
                onDelete: 'CASCADE',
            }));
        }

        isColumnExist = await table.findColumnByName('user_id');
        if (!isColumnExist) {
            await queryRunner.addColumn('final_exam_attempts', new TableColumn({
                name: 'user_id',
                type: 'uuid',
                isNullable: true,
            }));
        }

        console.info('MIGRATION - FinalExamAttemptMigration - Success');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const table = await queryRunner.getTable('final_exam_attempts');
        const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('final_exam_id') !== -1);
        await queryRunner.dropForeignKey('final_exam_attempts', foreignKey);
        await queryRunner.dropColumn('final_exam_attempts', 'final_exam_id');

        await queryRunner.dropColumn('final_exam_attempts', 'user_id');

        await queryRunner.dropTable('final_exam_attempts');

        console.info('REVERT MIGRATION - FinalExamAttemptMigration - Success');
    }

}
