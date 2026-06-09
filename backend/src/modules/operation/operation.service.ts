import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EOperationType } from 'src/shared/enums/EOperationType';
import { Brackets, EntityManager, Repository } from 'typeorm';
import { Account } from '../account/entities/account.entity';
import { Card } from '../card/entities/card.entity';
import { QueryOperationsDto } from './dto/query-operations.dto';
import { Operation } from './entities/operation.entity';

export interface RecordOperationDto {
	type: EOperationType;
	amount?: number | null;
	fromAccountId?: string | null;
	fromAccountNumber?: string | null;
	toAccountId?: string | null;
	toAccountNumber?: string | null;
	relatedCardId?: string | null;
	relatedAccountId?: string | null;
	userId: string;
	description?: string | null;
}

export interface PaginatedOperations {
	items: Operation[];
	total: number;
	limit: number;
	offset: number;
}

@Injectable()
export class OperationService {
	constructor(
		@InjectRepository(Operation)
		private readonly operationRepository: Repository<Operation>,
		@InjectRepository(Account)
		private readonly accountRepository: Repository<Account>,
		@InjectRepository(Card)
		private readonly cardRepository: Repository<Card>,
	) {}

	async record(dto: RecordOperationDto): Promise<void> {
		const op = this.operationRepository.create(dto);
		await this.operationRepository.save(op);
	}

	// Used when recording must be part of an existing DB transaction
	async recordWithManager(manager: EntityManager, dto: RecordOperationDto): Promise<void> {
		const op = manager.create(Operation, dto);
		await manager.save(Operation, op);
	}

	async findAllForUser(userId: string, query: QueryOperationsDto): Promise<PaginatedOperations> {
		const userAccounts = await this.accountRepository.find({
			where: { user: { id: userId } },
			select: { id: true },
		});
		const accountIds = userAccounts.map((a) => a.id);

		if (accountIds.length === 0) {
			return { items: [], total: 0, limit: query.limit, offset: query.offset };
		}

		const [items, total] = await this.operationRepository
			.createQueryBuilder('op')
			.where(
				new Brackets((b) =>
					b
						.where('op.fromAccountId IN (:...accountIds)', { accountIds })
						.orWhere('op.toAccountId IN (:...accountIds)', { accountIds })
						.orWhere('op.relatedAccountId IN (:...accountIds)', { accountIds }),
				),
			)
			.orderBy('op.createdAt', 'DESC')
			.addOrderBy('op.id', 'DESC')
			.skip(query.offset)
			.take(query.limit)
			.getManyAndCount();

		return { items, total, limit: query.limit, offset: query.offset };
	}

	async findByAccount(
		accountId: string,
		userId: string,
		query: QueryOperationsDto,
	): Promise<PaginatedOperations> {
		const isOwner = await this.accountRepository.exists({
			where: { id: accountId, user: { id: userId } },
		});
		if (!isOwner) throw new NotFoundException('Счёт не найден');

		const [items, total] = await this.operationRepository
			.createQueryBuilder('op')
			.where(
				new Brackets((b) =>
					b
						.where('op.fromAccountId = :accountId', { accountId })
						.orWhere('op.toAccountId = :accountId', { accountId })
						.orWhere('op.relatedAccountId = :accountId', { accountId }),
				),
			)
			.orderBy('op.createdAt', 'DESC')
			.addOrderBy('op.id', 'DESC')
			.skip(query.offset)
			.take(query.limit)
			.getManyAndCount();

		return { items, total, limit: query.limit, offset: query.offset };
	}

	async findByCard(
		cardId: string,
		userId: string,
		query: QueryOperationsDto,
	): Promise<PaginatedOperations> {
		const isOwner = await this.cardRepository.exists({
			where: { id: cardId, user: { id: userId } },
		});
		if (!isOwner) throw new NotFoundException('Карта не найдена');

		// Card history shows only transfers initiated via this card number
		const [items, total] = await this.operationRepository
			.createQueryBuilder('op')
			.where('op.relatedCardId = :cardId', { cardId })
			.andWhere('op.type = :type', { type: EOperationType.Transfer })
			.orderBy('op.createdAt', 'DESC')
			.addOrderBy('op.id', 'DESC')
			.skip(query.offset)
			.take(query.limit)
			.getManyAndCount();

		return { items, total, limit: query.limit, offset: query.offset };
	}

	async findOne(id: string, userId: string): Promise<Operation> {
		const op = await this.operationRepository.findOne({ where: { id } });
		if (!op) throw new NotFoundException('Операция не найдена');

		const userAccounts = await this.accountRepository.find({
			where: { user: { id: userId } },
			select: { id: true },
		});
		const accountIds = new Set(userAccounts.map((a) => a.id));

		const hasAccess =
			(op.fromAccountId !== null && accountIds.has(op.fromAccountId)) ||
			(op.toAccountId !== null && accountIds.has(op.toAccountId)) ||
			(op.relatedAccountId !== null && accountIds.has(op.relatedAccountId));

		if (!hasAccess) throw new NotFoundException('Операция не найдена');

		return op;
	}
}
