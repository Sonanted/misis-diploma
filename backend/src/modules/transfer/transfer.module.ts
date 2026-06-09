import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../account/entities/account.entity';
import { Card } from '../card/entities/card.entity';
import { UserModule } from '../user/user.module';
import { TransferController } from './transfer.controller';
import { TransferService } from './transfer.service';

@Module({
	imports: [TypeOrmModule.forFeature([Account, Card]), UserModule],
	controllers: [TransferController],
	providers: [TransferService],
})
export class TransferModule {}
