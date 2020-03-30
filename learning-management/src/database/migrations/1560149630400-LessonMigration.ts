import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from 'typeorm';

export class LessonMigration1560149630400 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        let table = await queryRunner.getTable('lessons');
        if (!table) {
            await queryRunner.createTable(new Table({
                name: 'lessons',
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
                        name: 'lesson_type',
                        type: 'varchar',
                        length: '10',
                    },
                    {
                        name: 'description',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'duration',
                        type: 'int',
                        default: 0,
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

        table = await queryRunner.getTable('lessons');
        const isColumnExist = await table.findColumnByName('playlist_id');
        if (!isColumnExist) {
            await queryRunner.addColumn('lessons', new TableColumn({
                name: 'playlist_id',
                type: 'uuid',
            }));

            await queryRunner.createForeignKey('lessons', new TableForeignKey({
                columnNames: ['playlist_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'playlists',
                onDelete: 'CASCADE',
            }));
        }

        console.info('MIGRATION - LessonMigration - Success');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const table = await queryRunner.getTable('lessons');
        const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('playlist_id') !== -1);
        await queryRunner.dropForeignKey('lessons', foreignKey);
        await queryRunner.dropColumn('lessons', 'playlist_id');

        await queryRunner.dropTable('lessons');

        console.info('REVERT MIGRATION - LessonMigration - Success');
    }

}
