import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from 'typeorm';

export class QuizAttemptMigration1560154639238 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        let table = await queryRunner.getTable('quiz_attempts');
        if (!table) {
            await queryRunner.createTable(new Table({
                name: 'quiz_attempts',
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

        table = await queryRunner.getTable('quiz_attempts');
        let isColumnExist = await table.findColumnByName('quiz_id');
        if (!isColumnExist) {
            await queryRunner.addColumn('quiz_attempts', new TableColumn({
                name: 'quiz_id',
                type: 'uuid',
            }));

            await queryRunner.createForeignKey('quiz_attempts', new TableForeignKey({
                columnNames: ['quiz_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'lessons',
                onDelete: 'CASCADE',
            }));
        }

        isColumnExist = await table.findColumnByName('user_id');
        if (!isColumnExist) {
            await queryRunner.addColumn('quiz_attempts', new TableColumn({
                name: 'user_id',
                type: 'uuid',
                isNullable: true,
            }));
        }

        console.info('MIGRATION - QuizAttemptMigration - Success');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const table = await queryRunner.getTable('quiz_attempts');
        const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('quiz_id') !== -1);
        await queryRunner.dropForeignKey('quiz_attempts', foreignKey);
        await queryRunner.dropColumn('quiz_attempts', 'quiz_id');

        await queryRunner.dropColumn('quiz_attempts', 'user_id');

        await queryRunner.dropTable('quiz_attempts');

        console.info('REVERT MIGRATION - QuizAttemptMigration - Success');
    }

}
