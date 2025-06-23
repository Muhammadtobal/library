import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1750684681437 implements MigrationInterface {
    name = 'CreateTables1750684681437'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`books\` ADD \`size\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`books\` ADD \`language\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`books\` ADD \`Number_pages\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`books\` ADD \`bio\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`books\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`books\` ADD \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`books\` DROP FOREIGN KEY \`FK_a0f13454de3df36e337e01dbd55\``);
        await queryRunner.query(`ALTER TABLE \`books\` DROP FOREIGN KEY \`FK_54f49efe2dd4d2850e736e9ab86\``);
        await queryRunner.query(`ALTER TABLE \`books\` CHANGE \`categoryId\` \`categoryId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`books\` CHANGE \`authorId\` \`authorId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`authors\` CHANGE \`bio\` \`bio\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`authors\` CHANGE \`image\` \`image\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`books\` ADD CONSTRAINT \`FK_a0f13454de3df36e337e01dbd55\` FOREIGN KEY (\`categoryId\`) REFERENCES \`categories\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`books\` ADD CONSTRAINT \`FK_54f49efe2dd4d2850e736e9ab86\` FOREIGN KEY (\`authorId\`) REFERENCES \`authors\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`books\` DROP FOREIGN KEY \`FK_54f49efe2dd4d2850e736e9ab86\``);
        await queryRunner.query(`ALTER TABLE \`books\` DROP FOREIGN KEY \`FK_a0f13454de3df36e337e01dbd55\``);
        await queryRunner.query(`ALTER TABLE \`authors\` CHANGE \`image\` \`image\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`authors\` CHANGE \`bio\` \`bio\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`books\` CHANGE \`authorId\` \`authorId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`books\` CHANGE \`categoryId\` \`categoryId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`books\` ADD CONSTRAINT \`FK_54f49efe2dd4d2850e736e9ab86\` FOREIGN KEY (\`authorId\`) REFERENCES \`authors\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`books\` ADD CONSTRAINT \`FK_a0f13454de3df36e337e01dbd55\` FOREIGN KEY (\`categoryId\`) REFERENCES \`categories\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`books\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`books\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`books\` DROP COLUMN \`bio\``);
        await queryRunner.query(`ALTER TABLE \`books\` DROP COLUMN \`Number_pages\``);
        await queryRunner.query(`ALTER TABLE \`books\` DROP COLUMN \`language\``);
        await queryRunner.query(`ALTER TABLE \`books\` DROP COLUMN \`size\``);
    }

}
