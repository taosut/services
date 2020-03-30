import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from 'typeorm';

export class PlaylistMigration1560149188139 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        let table = await queryRunner.getTable('playlists');
        if (!table) {
            await queryRunner.createTable(new Table({
                name: 'playlists',
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

        table = await queryRunner.getTable('playlists');
        const isColumnExist = await table.findColumnByName('course_id');
        if (!isColumnExist) {
            await queryRunner.addColumn('playlists', new TableColumn({
                name: 'course_id',
                type: 'uuid',
            }));

            await queryRunner.createForeignKey('playlists', new TableForeignKey({
                columnNames: ['course_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'courses',
                onDelete: 'CASCADE',
            }));
        }

        console.info('MIGRATION - PlaylistMigration - Success');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const table = await queryRunner.getTable('playlists');
        const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('course_id') !== -1);
        await queryRunner.dropForeignKey('playlists', foreignKey);
        await queryRunner.dropColumn('playlists', 'course_id');

        await queryRunner.dropTable('playlists');

        console.info('REVERT MIGRATION - PlaylistMigration - Success');
    }
}
