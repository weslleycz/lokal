import { MigrationInterface, QueryRunner } from "typeorm";

export class PlantEntity1757742949279 implements MigrationInterface {
    name = 'PlantEntity1757742949279'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`plants\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`location\` varchar(255) NOT NULL, \`date\` varchar(255) NOT NULL, \`image\` varchar(255) NULL, \`userId\` uuid NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`plants\` ADD CONSTRAINT \`FK_650cef4aec997aa636f8fa7e8a0\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`plants\` DROP FOREIGN KEY \`FK_650cef4aec997aa636f8fa7e8a0\``);
        await queryRunner.query(`DROP TABLE \`plants\``);
    }

}
