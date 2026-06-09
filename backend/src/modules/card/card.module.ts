import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from '../account/account.module';
import { OperationModule } from '../operation/operation.module';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { Card } from './entities/card.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Card]), AccountModule, OperationModule],
	controllers: [CardController],
	providers: [CardService],
	exports: [CardService],
})
export class CardModule {}
