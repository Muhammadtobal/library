import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1750683872927 implements MigrationInterface {
    name = 'CreateTables1750683872927'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`books\` DROP COLUMN \`description\``);
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
        await queryRunner.query(`ALTER TABLE \`books\` ADD \`description\` varchar(255) NOT NULL`);
    }

}
