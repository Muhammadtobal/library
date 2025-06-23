import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1750585700158 implements MigrationInterface {
    name = 'CreateTables1750585700158'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`authors\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`bio\` text NULL, \`birth_date\` date NULL, \`death_date\` date NULL, \`nationality\` varchar(100) NULL, \`genres\` text NULL, \`language\` varchar(50) NULL, \`awards\` text NULL, \`image\` varchar(255) NULL, \`created_at\` datetime NOT NULL, \`updated_at\` datetime NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`authors\``);
    }

}
