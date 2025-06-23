import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1750585632218 implements MigrationInterface {
    name = 'CreateTables1750585632218'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`categories\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`categories\` ADD \`created_at\` datetime NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`categories\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`categories\` ADD \`updated_at\` datetime NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`categories\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`categories\` ADD \`updated_at\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`categories\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`categories\` ADD \`created_at\` varchar(255) NOT NULL`);
    }

}
