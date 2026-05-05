import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAccountNumberSeq1000000000000 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
            CREATE SEQUENCE IF NOT EXISTS account_number_seq
            START 1000000
            INCREMENT 1;
        `);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      DROP SEQUENCE IF EXISTS account_number_seq;
    `);
	}
}
