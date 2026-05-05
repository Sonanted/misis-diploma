import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
	type: 'postgres',
	host: 'localhost',
	port: 5432,
	username: 'postgres',
	password: 'postgres',
	database: 'diploma-db',
	entities: ['dist/**/*.entity.js'],
	migrations: ['dist/src/database/migrations/*.js'],
});
