import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from 'typeorm';

export class ContentMigration1560151137599 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        let table = await queryRunner.getTable('contents');
        if (!table) {
            await queryRunner.createTable(new Table({
                name: 'contents',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'uuid',
                    },
                    {
                        name: 'content',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'video_source',
                        type: 'varchar',
                        length: '100',
                        isNullable: true,
                    },
                    {
                        name: 'video_link',
                        type: 'varchar',
                        length: '250',
                        isNullable: true,
                    },
                    {
                        name: 'duration',
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

        table = await queryRunner.getTable('contents');
        const isColumnExist = await table.findColumnByName('lesson_id');
        if (!isColumnExist) {
            await queryRunner.addColumn('contents', new TableColumn({
                name: 'lesson_id',
                type: 'uuid',
            }));

            await queryRunner.createForeignKey('contents', new TableForeignKey({
                columnNames: ['lesson_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'lessons',
                onDelete: 'CASCADE',
            }));
        }

        console.info('MIGRATION - ContentMigration - Success');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const table = await queryRunner.getTable('contents');
        const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('lesson_id') !== -1);
        await queryRunner.dropForeignKey('contents', foreignKey);
        await queryRunner.dropColumn('contents', 'lesson_id');

        await queryRunner.dropTable('contents');

        console.info('REVERT MIGRATION - ContentMigration - Success');
    }

}
