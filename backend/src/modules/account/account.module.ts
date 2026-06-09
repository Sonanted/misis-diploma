import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OperationModule } from '../operation/operation.module';
import { UserModule } from '../user/user.module';
import { AccountsController } from './account.controller';
import { AccountService } from './account.service';
import { Account } from './entities/account.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Account]), UserModule, OperationModule],
	controllers: [AccountsController],
	providers: [AccountService],
	exports: [AccountService],
})
export class AccountModule {}
