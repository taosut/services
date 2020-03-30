import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from 'typeorm';

export class FinalExamMigration1562308241638 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        let table = await queryRunner.getTable('final_exams');
        if (!table) {
            await queryRunner.createTable(new Table({
                name: 'final_exams',
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
                        name: 'published',
                        type: 'boolean',
                        default: false,
                    },
                    {
                        name: 'start_at',
                        type: 'timestamptz',
                        isNullable: true,
                    },
                    {
                        name: 'end_at',
                        type: 'timestamptz',
                        isNullable: true,
                    },
                    {
                        name: 'track_id',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'course_id',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'playlist_id',
                        type: 'uuid',
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

        table = await queryRunner.getTable('final_exams');
        const isColumnExist = await table.findColumnByName('user_id');
        if (!isColumnExist) {
            await queryRunner.addColumn('final_exams', new TableColumn({
                name: 'user_id',
                type: 'uuid',
                isNullable: true,
            }));
        }

        await queryRunner.createForeignKey('final_exams', new TableForeignKey({
            columnNames: ['track_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'tracks',
            onDelete: 'CASCADE',
        }));

        await queryRunner.createForeignKey('final_exams', new TableForeignKey({
            columnNames: ['course_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'courses',
            onDelete: 'CASCADE',
        }));

        await queryRunner.createForeignKey('final_exams', new TableForeignKey({
            columnNames: ['playlist_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'playlists',
            onDelete: 'CASCADE',
        }));

        console.info('MIGRATION - FinalExamMigration - Success');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const table = await queryRunner.getTable('final_exams');
        let foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('track_id') !== -1);
        await queryRunner.dropForeignKey('final_exams', foreignKey);
        await queryRunner.dropColumn('final_exams', 'track_id');

        foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('course_id') !== -1);
        await queryRunner.dropForeignKey('final_exams', foreignKey);
        await queryRunner.dropColumn('final_exams', 'course_id');

        foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('playlist_id') !== -1);
        await queryRunner.dropForeignKey('final_exams', foreignKey);
        await queryRunner.dropColumn('final_exams', 'playlist_id');

        await queryRunner.dropColumn('final_exams', 'user_id');

        await queryRunner.dropTable('final_exams');

        console.info('REVERT MIGRATION - FinalExamMigration - Success');
    }

}
