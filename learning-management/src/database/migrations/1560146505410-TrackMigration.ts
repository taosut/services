import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from 'typeorm';

export class TrackMigration1560146505410 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        let table = await queryRunner.getTable('tracks');
        if (!table) {
            await queryRunner.createTable(new Table({
                name: 'tracks',
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
                        name: 'requirement',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'published',
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

        table = await queryRunner.getTable('tracks');
        const isColumnExist = await table.findColumnByName('user_id');
        if (!isColumnExist) {
            await queryRunner.addColumn('tracks', new TableColumn({
                name: 'user_id',
                type: 'uuid',
                isNullable: true,
            }));
        }

        console.info('MIGRATION - TrackMigration - Success');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        // await queryRunner.query(`ALTER TABLE "tracks" RENAME COLUMN "track_title" TO "title"`);
        await queryRunner.dropColumn('tracks', 'user_id');

        await queryRunner.dropTable('tracks');

        console.info('REVERT MIGRATION - TrackMigration - Success');
    }
}
