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
	currency?: string | null;
}

export type CurrencySummaryEntry = { income: number; expenses: number };
export type MonthlySummary = Record<string, CurrencySummaryEntry>;

export interface PaginatedOperations {
	items: Operation[];
	total: number;
	limit: number;
	offset: number;
}

const CARD_OP_TYPES = [
	EOperationType.CardIssued,
	EOperationType.CardClosed,
	EOperationType.CardLocked,
	EOperationType.CardUnlocked,
	EOperationType.CardPinChanged,
];

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

	async getMonthlySummary(userId: string): Promise<MonthlySummary> {
		const userAccounts = await this.accountRepository.find({
			where: { user: { id: userId } },
			select: { id: true, currency: true },
		});
		const accountIds = userAccounts.map((a) => a.id);
		if (accountIds.length === 0) return { RUB: { income: 0, expenses: 0 } };

		const accountCurrencyMap = new Map(userAccounts.map((a) => [a.id, a.currency as string]));

		const now = new Date();
		const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
		const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

		const ops = await this.operationRepository
			.createQueryBuilder('op')
			.where(
				new Brackets((b) =>
					b
						.where('op.fromAccountId IN (:...accountIds)', { accountIds })
						.orWhere('op.toAccountId IN (:...accountIds)', { accountIds }),
				),
			)
			.andWhere('op.createdAt >= :monthStart', { monthStart })
			.andWhere('op.createdAt < :monthEnd', { monthEnd })
			.getMany();

		return this.computeSummary(ops, new Set(accountIds), accountCurrencyMap);
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

		const qb = this.operationRepository
			.createQueryBuilder('op')
			.where(
				new Brackets((b) =>
					b
						.where('op.fromAccountId IN (:...accountIds)', { accountIds })
						.orWhere('op.toAccountId IN (:...accountIds)', { accountIds })
						.orWhere('op.relatedAccountId IN (:...accountIds)', { accountIds }),
				),
			);

		this.applyDirectionFilter(qb, query.direction, accountIds);
		this.applyDateFilter(qb, query.dateFrom, query.dateTo);

		const [items, total] = await qb
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

		const qb = this.operationRepository
			.createQueryBuilder('op')
			.where(
				new Brackets((b) =>
					b
						.where('op.fromAccountId = :accountId', { accountId })
						.orWhere('op.toAccountId = :accountId', { accountId })
						.orWhere('op.relatedAccountId = :accountId', { accountId }),
				),
			);

		if (query.direction) {
			switch (query.direction) {
				case 'incoming':
					qb.andWhere('op.toAccountId = :accountId', { accountId });
					break;
				case 'outgoing':
					qb.andWhere('op.fromAccountId = :accountId', { accountId });
					break;
				case 'other':
					qb.andWhere('op.type IN (:...cardTypes)', { cardTypes: CARD_OP_TYPES });
					break;
			}
		}

		this.applyDateFilter(qb, query.dateFrom, query.dateTo);

		const [items, total] = await qb
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

		const qb = this.operationRepository
			.createQueryBuilder('op')
			.where('op.relatedCardId = :cardId', { cardId })
			.andWhere('op.type = :type', { type: EOperationType.Transfer });

		this.applyDateFilter(qb, query.dateFrom, query.dateTo);

		const [items, total] = await qb
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

	private applyDirectionFilter(
		qb: ReturnType<typeof this.operationRepository.createQueryBuilder>,
		direction: QueryOperationsDto['direction'],
		accountIds: string[],
	): void {
		if (!direction) return;

		switch (direction) {
			case 'incoming':
				qb.andWhere(
					new Brackets((b) =>
						b
							.where('op.type = :topup', { topup: EOperationType.Topup })
							.orWhere(
								'op.type = :transfer AND op.toAccountId IN (:...accountIds) AND (op.fromAccountId NOT IN (:...accountIds) OR op.fromAccountId IS NULL)',
								{ transfer: EOperationType.Transfer, accountIds },
							),
					),
				);
				break;
			case 'outgoing':
				qb.andWhere(
					new Brackets((b) =>
						b
							.where('op.type = :monthly', { monthly: EOperationType.MonthlyPayment })
							.orWhere(
								'op.type = :transfer AND op.fromAccountId IN (:...accountIds) AND (op.toAccountId NOT IN (:...accountIds) OR op.toAccountId IS NULL)',
								{ transfer: EOperationType.Transfer, accountIds },
							),
					),
				);
				break;
			case 'internal':
				qb.andWhere(
					'op.type = :transfer AND op.fromAccountId IN (:...accountIds) AND op.toAccountId IN (:...accountIds)',
					{ transfer: EOperationType.Transfer, accountIds },
				);
				break;
			case 'other':
				qb.andWhere('op.type IN (:...cardTypes)', { cardTypes: CARD_OP_TYPES });
				break;
		}
	}

	private applyDateFilter(
		qb: ReturnType<typeof this.operationRepository.createQueryBuilder>,
		dateFrom?: string,
		dateTo?: string,
	): void {
		if (dateFrom) {
			qb.andWhere('op.createdAt >= :dateFrom', { dateFrom: new Date(dateFrom) });
		}
		if (dateTo) {
			const end = new Date(dateTo);
			end.setDate(end.getDate() + 1);
			qb.andWhere('op.createdAt < :dateTo', { dateTo: end });
		}
	}

	private computeSummary(
		ops: Operation[],
		accountIds: Set<string>,
		accountCurrencyMap: Map<string, string>,
	): MonthlySummary {
		const result: MonthlySummary = { RUB: { income: 0, expenses: 0 } };

		for (const op of ops) {
			if (op.amount !== null) {
				this.applyOpToSummary(result, op, accountIds, accountCurrencyMap);
			}
		}

		return result;
	}

	private applyOpToSummary(
		result: MonthlySummary,
		op: Operation,
		accountIds: Set<string>,
		accountCurrencyMap: Map<string, string>,
	): void {
		const ensure = (c: string) => { if (!result[c]) result[c] = { income: 0, expenses: 0 }; };
		const amount = op.amount as number;

		if (op.type === EOperationType.Topup) {
			const c = op.currency ?? accountCurrencyMap.get(op.toAccountId ?? '') ?? 'RUB';
			ensure(c);
			result[c].income += amount;
			return;
		}

		if (op.type === EOperationType.MonthlyPayment) {
			const c = op.currency ?? accountCurrencyMap.get(op.fromAccountId ?? '') ?? 'RUB';
			ensure(c);
			result[c].expenses += amount;
			return;
		}

		if (op.type === EOperationType.Transfer) {
			this.applyTransferToSummary(result, op, amount, accountIds, accountCurrencyMap);
		}
	}

	private applyTransferToSummary(
		result: MonthlySummary,
		op: Operation,
		amount: number,
		accountIds: Set<string>,
		accountCurrencyMap: Map<string, string>,
	): void {
		const ensure = (c: string) => { if (!result[c]) result[c] = { income: 0, expenses: 0 }; };
		const fromOurs = op.fromAccountId !== null && accountIds.has(op.fromAccountId);
		const toOurs = op.toAccountId !== null && accountIds.has(op.toAccountId);

		if (fromOurs && !toOurs) {
			const c = op.currency ?? accountCurrencyMap.get(op.fromAccountId ?? '') ?? 'RUB';
			ensure(c);
			result[c].expenses += amount;
		} else if (toOurs && !fromOurs) {
			// Resolve to receiving account's currency for correct bucketing
			const c = accountCurrencyMap.get(op.toAccountId ?? '') ?? op.currency ?? 'RUB';
			ensure(c);
			result[c].income += amount;
		}
	}
}
