import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from 'typeorm';

export class CourseMigration1560147976901 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        let table = await queryRunner.getTable('courses');
        if (!table) {
            await queryRunner.createTable(new Table({
                name: 'courses',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'uuid',
                    },
                    {
                        name: 'title',
                        type: 'varchar',
                        length: '200',
                    },
                    {
                        name: 'slug',
                        type: 'varchar',
                        length: '250',
                        isUnique: true,
                    },
                    {
                        name: 'preview',
                        type: 'varchar',
                        length: '250',
                        isNullable: true,
                    },
                    {
                        name: 'description',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'term_and_condition',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'published',
                        type: 'boolean',
                        default: false,
                    },
                    {
                        name: 'approved',
                        type: 'boolean',
                        default: false,
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
                    {
                        name: 'deleted_at',
                        type: 'timestamptz',
                        isNullable: true,
                    },
                ],
            }), true);
        }

        table = await queryRunner.getTable('courses');
        let isColumnExist = await table.findColumnByName('track_id');
        if (!isColumnExist) {
            await queryRunner.addColumn('courses', new TableColumn({
                name: 'track_id',
                type: 'uuid',
                isNullable: true,
            }));

            await queryRunner.createForeignKey('courses', new TableForeignKey({
                columnNames: ['track_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'tracks',
                onDelete: 'CASCADE',
            }));
        }

        isColumnExist = await table.findColumnByName('user_id');
        if (!isColumnExist) {
            await queryRunner.addColumn('courses', new TableColumn({
                name: 'user_id',
                type: 'uuid',
                isNullable: true,
            }));
        }

        console.info('MIGRATION - CourseMigration - Success');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const table = await queryRunner.getTable('courses');
        const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('track_id') !== -1);
        await queryRunner.dropForeignKey('courses', foreignKey);
        await queryRunner.dropColumn('courses', 'track_id');

        await queryRunner.dropColumn('courses', 'user_id');

        await queryRunner.dropTable('courses');

        console.info('REVERT MIGRATION - CourseMigration - Success');
    }

}
