import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EAccountStatus } from 'src/shared/enums/EAccountStatus';
import { EAccountType } from 'src/shared/enums/EAccountType';
import { EOperationType } from 'src/shared/enums/EOperationType';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Account } from '../account/entities/account.entity';
import { IAuthRequest } from '../auth/interfaces/IAuthRequest';
import { Card } from '../card/entities/card.entity';
import { OperationService } from '../operation/operation.service';
import { UserService } from '../user/user.service';
import { CreateTransferDto } from './dto/create-transfer.dto';

export interface TransferResult {
	fromAccountId: string;
	toAccountId: string;
	amount: number;
}

interface ResolvedDestination {
	accountId: string;
	cardId: string | null;
}

@Injectable()
export class TransferService {
	constructor(
		@InjectRepository(Account)
		private readonly accountRepository: Repository<Account>,
		@InjectRepository(Card)
		private readonly cardRepository: Repository<Card>,
		private readonly userService: UserService,
		private readonly operationService: OperationService,
		private readonly dataSource: DataSource,
	) {}

	async transfer(req: IAuthRequest, dto: CreateTransferDto): Promise<TransferResult> {
		// Verify ownership outside the transaction: account ownership is immutable,
		// so this check is safe without a lock. It uses a JOIN that is incompatible
		// with FOR UPDATE — hence it must stay outside the locked transaction.
		const isOwner = await this.accountRepository.exists({
			where: { id: dto.fromAccountId, user: { id: req.user.id } },
		});
		if (!isOwner) throw new NotFoundException('Счёт-источник не найден');

		// Resolve destination account ID before the transaction (non-balance read, no lock needed)
		const destination = await this.resolveDestination(dto.method, dto.recipientIdentifier);

		if (dto.fromAccountId === destination.accountId) {
			throw new BadRequestException('Нельзя переводить на тот же счёт');
		}

		return this.dataSource.transaction(async (manager) => {
			// Lock both rows in a consistent order by ID to prevent deadlocks.
			// If two concurrent transactions transfer between the same pair of accounts
			// in opposite directions, they both try to lock the same "first" row,
			// so one blocks until the other commits — no deadlock possible.
			const [firstId, secondId] = [dto.fromAccountId, destination.accountId].sort();

			const firstAccount = await this.lockAccount(manager, firstId);
			const secondAccount = await this.lockAccount(manager, secondId);

			const fromAccount = firstId === dto.fromAccountId ? firstAccount : secondAccount;
			const toAccount = firstId === destination.accountId ? firstAccount : secondAccount;

			this.validateSource(fromAccount, dto.amount);
			this.validateDestination(toAccount);

			const newFromBalance = parseFloat((fromAccount.balance - dto.amount).toFixed(2));
			// Credit accounts store debt: balance = amount owed. Receiving money reduces the debt.
			const newToBalance = toAccount.type === EAccountType.Credit
				? parseFloat((toAccount.balance - dto.amount).toFixed(2))
				: parseFloat((toAccount.balance + dto.amount).toFixed(2));

			if (toAccount.type === EAccountType.Credit && newToBalance < 0) {
				throw new BadRequestException('Сумма перевода превышает задолженность по кредитному счёту');
			}

			await manager.update(Account, { id: fromAccount.id }, { balance: newFromBalance });
			await manager.update(Account, { id: toAccount.id }, { balance: newToBalance });

			// Record operation inside the same transaction so a failed save rolls back the transfer
			await this.operationService.recordWithManager(manager, {
				type: EOperationType.Transfer,
				amount: dto.amount,
				fromAccountId: fromAccount.id,
				fromAccountNumber: fromAccount.accountNumber,
				toAccountId: toAccount.id,
				toAccountNumber: toAccount.accountNumber,
				relatedCardId: destination.cardId,
				userId: req.user.id,
				description: dto.description ?? null,
			});

			return { fromAccountId: fromAccount.id, toAccountId: toAccount.id, amount: dto.amount };
		});
	}

	// Uses QueryBuilder instead of findOne so the lock applies only to the "account" table,
	// not to any LEFT-JOINed relation — PostgreSQL rejects FOR UPDATE on the nullable side
	// of an outer join.
	private async lockAccount(manager: EntityManager, id: string): Promise<Account> {
		const account = await manager
			.createQueryBuilder(Account, 'account')
			.setLock('pessimistic_write')
			.where('account.id = :id', { id })
			.getOne();
		if (!account) throw new NotFoundException(`Счёт ${id} не найден`);
		return account;
	}

	private validateSource(account: Account, amount: number): void {
		if (account.status !== EAccountStatus.Active)
			throw new BadRequestException('Счёт-источник неактивен');
		if (account.type === EAccountType.Credit)
			throw new BadRequestException('Нельзя совершать переводы с кредитного счёта');
		if (account.balance < amount)
			throw new BadRequestException('Недостаточно средств на счёте');
	}

	private validateDestination(account: Account): void {
		if (account.status !== EAccountStatus.Active)
			throw new BadRequestException('Счёт получателя неактивен');
	}

	private async resolveDestination(
		method: 'account' | 'phone' | 'card',
		identifier: string,
	): Promise<ResolvedDestination> {
		if (method === 'account') {
			const account = await this.accountRepository.findOne({
				where: { accountNumber: identifier },
			});
			if (!account) throw new NotFoundException('Счёт с таким номером не найден в банке');
			return { accountId: account.id, cardId: null };
		}

		if (method === 'phone') {
			let user: Awaited<ReturnType<UserService['findOne']>>;
			try {
				user = await this.userService.findOne({ phone: identifier });
			} catch {
				throw new NotFoundException('Пользователь с таким номером телефона не найден в банке');
			}
			if (!user.primaryAccountId)
				throw new BadRequestException('У получателя не установлен счёт по умолчанию');
			return { accountId: user.primaryAccountId, cardId: null };
		}

		// card
		const card = await this.cardRepository.findOne({
			where: { cardNumber: identifier },
			relations: ['account'],
		});
		if (!card) throw new NotFoundException('Карта с таким номером не найдена в банке');
		return { accountId: card.account.id, cardId: card.id };
	}
}
