import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../account/entities/account.entity';
import { Card } from '../card/entities/card.entity';
import { OperationController } from './operation.controller';
import { OperationService } from './operation.service';
import { Operation } from './entities/operation.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Operation, Account, Card])],
	controllers: [OperationController],
	providers: [OperationService],
	exports: [OperationService],
})
export class OperationModule {}
