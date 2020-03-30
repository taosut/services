import {MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey} from 'typeorm';

export class ContentAttachmentMigration1560151587622 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        let table = await queryRunner.getTable('content_attachments');
        if (!table) {
            await queryRunner.createTable(new Table({
                name: 'content_attachments',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'uuid',
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                        length: '200',
                        isNullable: true,
                    },
                    {
                        name: 'type',
                        type: 'varchar',
                        length: '50',
                        isNullable: true,
                    },
                    {
                        name: 'size',
                        type: 'int',
                        default: 0,
                    },
                    {
                        name: 'path',
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

        table = await queryRunner.getTable('content_attachments');
        const isColumnExist = await table.findColumnByName('content_id');
        if (!isColumnExist) {
            await queryRunner.addColumn('content_attachments', new TableColumn({
                name: 'content_id',
                type: 'uuid',
            }));

            await queryRunner.createForeignKey('content_attachments', new TableForeignKey({
                columnNames: ['content_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'contents',
                onDelete: 'CASCADE',
            }));
        }

        console.info('MIGRATION - ContentAttachmentMigration - Success');
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const table = await queryRunner.getTable('content_attachments');
        const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('content_id') !== -1);
        await queryRunner.dropForeignKey('content_attachments', foreignKey);
        await queryRunner.dropColumn('content_attachments', 'content_id');

        await queryRunner.dropTable('content_attachments');

        console.info('REVERT MIGRATION - ContentAttachmentMigration - Success');
    }

}
