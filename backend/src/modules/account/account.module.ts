import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { AccountsController } from './account.controller';
import { AccountService } from './account.service';
import { Account } from './entities/account.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Account]), UserModule],
	controllers: [AccountsController],
	providers: [AccountService],
	exports: [AccountService],
})
export class AccountModule {}
