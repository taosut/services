import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from 'typeorm';

export class CourseUserMigration1560151926947 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        let table = await queryRunner.getTable('course_users');
        if (!table) {
            await queryRunner.createTable(new Table({
                name: 'course_users',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'uuid',
                    },
                    {
                        name: 'has_joined',
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

        table = await queryRunner.getTable('course_users');
        let isColumnExist = await table.findColumnByName('course_id');
        if (!isColumnExist) {
            await queryRunner.addColumn('course_users', new TableColumn({
                name: 'course_id',
                type: 'uuid',
            }));

            await queryRunner.createForeignKey('course_users', new TableForeignKey({
                columnNames: ['course_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'courses',
                onDelete: 'CASCADE',
            }));
        }

        isColumnExist = await table.findColumnByName('user_id');
        if (!isColumnExist) {
            await queryRunner.addColumn('course_users', new TableColumn({
                name: 'user_id',
                type: 'uuid',
            }));
        }

        console.info('MIGRATION - CourseUserMigration - Success');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const table = await queryRunner.getTable('course_users');
        const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('course_id') !== -1);
        await queryRunner.dropForeignKey('course_users', foreignKey);
        await queryRunner.dropColumn('course_users', 'course_id');

        await queryRunner.dropColumn('course_users', 'user_id');

        await queryRunner.dropTable('course_users');

        console.info('REVERT MIGRATION - CourseUserMigration - Success');
    }
}
