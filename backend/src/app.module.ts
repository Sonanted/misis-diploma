import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from './config/config.module';
import { AccountModule } from './modules/account/account.module';
import { Account } from './modules/account/entities/account.entity';
import { AuthModule } from './modules/auth/auth.module';
import { CardModule } from './modules/card/card.module';
import { Card } from './modules/card/entities/card.entity';
import { Operation } from './modules/operation/entities/operation.entity';
import { OperationModule } from './modules/operation/operation.module';
import { TransferModule } from './modules/transfer/transfer.module';
import { User } from './modules/user/entities/user.entity';
import { UserModule } from './modules/user/user.module';

@Module({
	imports: [
		ConfigModule,

		TypeOrmModule.forRoot({
			type: 'postgres',
			host: 'localhost',
			port: 5432,
			username: 'postgres',
			password: 'postgres',
			database: 'diploma-db',
			entities: [User, Account, Card, Operation],
			migrations: ['dist/src/database/migrations/*.js'],
			synchronize: true,
		}),

		AuthModule,
		UserModule,
		AccountModule,
		CardModule,
		TransferModule,
		OperationModule,
	],
})
export class AppModule {}
