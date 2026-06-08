import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCardNumberSeq1000000000001 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
            CREATE SEQUENCE IF NOT EXISTS card_number_seq
            START 100000000
            INCREMENT 1;
        `);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
            DROP SEQUENCE IF EXISTS card_number_seq;
        `);
	}
}
