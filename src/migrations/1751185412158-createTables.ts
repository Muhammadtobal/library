import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1751185412158 implements MigrationInterface {
    name = 'CreateTables1751185412158'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`books\` ADD \`image\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`my_library\` DROP FOREIGN KEY \`FK_99ccaea8c3f68e6ca81ead1b1aa\``);
        await queryRunner.query(`ALTER TABLE \`my_library\` CHANGE \`userId\` \`userId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`reviews\` DROP FOREIGN KEY \`FK_3566320dcb46788637a0ef50d2b\``);
        await queryRunner.query(`ALTER TABLE \`reviews\` DROP FOREIGN KEY \`FK_cab4e55252a9c18a27e81415299\``);
        await queryRunner.query(`ALTER TABLE \`reviews\` CHANGE \`myLibraryId\` \`myLibraryId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`reviews\` CHANGE \`bookId\` \`bookId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`books\` DROP FOREIGN KEY \`FK_a0f13454de3df36e337e01dbd55\``);
        await queryRunner.query(`ALTER TABLE \`books\` DROP FOREIGN KEY \`FK_54f49efe2dd4d2850e736e9ab86\``);
        await queryRunner.query(`ALTER TABLE \`books\` CHANGE \`bio\` \`bio\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`books\` CHANGE \`categoryId\` \`categoryId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`books\` CHANGE \`authorId\` \`authorId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`authors\` CHANGE \`bio\` \`bio\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`authors\` CHANGE \`image\` \`image\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`my_library\` ADD CONSTRAINT \`FK_99ccaea8c3f68e6ca81ead1b1aa\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reviews\` ADD CONSTRAINT \`FK_3566320dcb46788637a0ef50d2b\` FOREIGN KEY (\`myLibraryId\`) REFERENCES \`my_library\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reviews\` ADD CONSTRAINT \`FK_cab4e55252a9c18a27e81415299\` FOREIGN KEY (\`bookId\`) REFERENCES \`books\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`books\` ADD CONSTRAINT \`FK_a0f13454de3df36e337e01dbd55\` FOREIGN KEY (\`categoryId\`) REFERENCES \`categories\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`books\` ADD CONSTRAINT \`FK_54f49efe2dd4d2850e736e9ab86\` FOREIGN KEY (\`authorId\`) REFERENCES \`authors\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`books\` DROP FOREIGN KEY \`FK_54f49efe2dd4d2850e736e9ab86\``);
        await queryRunner.query(`ALTER TABLE \`books\` DROP FOREIGN KEY \`FK_a0f13454de3df36e337e01dbd55\``);
        await queryRunner.query(`ALTER TABLE \`reviews\` DROP FOREIGN KEY \`FK_cab4e55252a9c18a27e81415299\``);
        await queryRunner.query(`ALTER TABLE \`reviews\` DROP FOREIGN KEY \`FK_3566320dcb46788637a0ef50d2b\``);
        await queryRunner.query(`ALTER TABLE \`my_library\` DROP FOREIGN KEY \`FK_99ccaea8c3f68e6ca81ead1b1aa\``);
        await queryRunner.query(`ALTER TABLE \`authors\` CHANGE \`image\` \`image\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`authors\` CHANGE \`bio\` \`bio\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`books\` CHANGE \`authorId\` \`authorId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`books\` CHANGE \`categoryId\` \`categoryId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`books\` CHANGE \`bio\` \`bio\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`books\` ADD CONSTRAINT \`FK_54f49efe2dd4d2850e736e9ab86\` FOREIGN KEY (\`authorId\`) REFERENCES \`authors\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`books\` ADD CONSTRAINT \`FK_a0f13454de3df36e337e01dbd55\` FOREIGN KEY (\`categoryId\`) REFERENCES \`categories\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reviews\` CHANGE \`bookId\` \`bookId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`reviews\` CHANGE \`myLibraryId\` \`myLibraryId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`reviews\` ADD CONSTRAINT \`FK_cab4e55252a9c18a27e81415299\` FOREIGN KEY (\`bookId\`) REFERENCES \`books\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reviews\` ADD CONSTRAINT \`FK_3566320dcb46788637a0ef50d2b\` FOREIGN KEY (\`myLibraryId\`) REFERENCES \`my_library\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`my_library\` CHANGE \`userId\` \`userId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`my_library\` ADD CONSTRAINT \`FK_99ccaea8c3f68e6ca81ead1b1aa\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`books\` DROP COLUMN \`image\``);
    }

}
