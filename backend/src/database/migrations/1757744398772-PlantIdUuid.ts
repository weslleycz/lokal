import { MigrationInterface, QueryRunner } from "typeorm";

export class PlantIdUuid1757744398772 implements MigrationInterface {
    name = 'PlantIdUuid1757744398772'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`plants\` CHANGE \`id\` \`id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`plants\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`plants\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`plants\` ADD \`id\` uuid NOT NULL PRIMARY KEY`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`plants\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`plants\` ADD \`id\` int NOT NULL AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`plants\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`plants\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`);
    }

}
