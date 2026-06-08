import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomConfigService } from 'src/config/config.service';
import { EAccountStatus } from 'src/shared/enums/EAccountStatus';
import { EAccountType } from 'src/shared/enums/EAccountType';
import { DataSource, FindOptionsWhere, Not, Repository } from 'typeorm';
import { IAuthRequest } from '../auth/interfaces/IAuthRequest';
import { UserService } from '../user/user.service';
import { BALANCE_SHEET_ACCOUNTS, BANK_CONFIG, CURRENCY_CODES } from './account.contants';
import { CreateAccountDto } from './dto/create-account.dto';
import { TopupAccountDto } from './dto/topup-account.dto';
import { UpdateAccountNameDto } from './dto/update-account-name.dto';
import { UpdateAccountStatusDto } from './dto/update-account-status.dto';
import { Account } from './entities/account.entity';

/**
 * Структура 20-значного банковского счёта РФ (по стандарту ЦБ РФ):
 *
 * [BBBBB] [CCC] [K] [LLLL] [NNNNNNN]
 *   5       3    1    4        7
 *
 * BBBBB — балансовый счёт (план счетов ЦБ РФ, Положение 579-П)
 * CCC   — код валюты (ISO 4217 numeric: RUB=810, USD=840, EUR=978)
 * K     — контрольная цифра (ключ)
 * LLLL  — номер структурного подразделения / лицевой части
 * NNNNNNN — порядковый номер (лицевой счёт)
 */

@Injectable()
export class AccountService {
	constructor(
		@InjectRepository(Account)
		private readonly accountRepository: Repository<Account>,
		private readonly dataSource: DataSource,
		private readonly userService: UserService,
		private readonly configService: CustomConfigService,
	) {}

	async create(req: IAuthRequest, dto: CreateAccountDto): Promise<Account> {
		const balanceSheetEntry = BALANCE_SHEET_ACCOUNTS[dto.type];
		if (!balanceSheetEntry) {
			throw new BadRequestException(`Неизвестный тип счёта: ${dto.type}`);
		}

		const currencyCode = CURRENCY_CODES[dto.currency];
		if (!currencyCode) {
			throw new BadRequestException(`Неподдерживаемая валюта: ${dto.currency}`);
		}

		if (dto.type === EAccountType.Credit && !dto.creditLimit) {
			throw new BadRequestException('Укажите кредитный лимит для кредитного счёта');
		}

		const user = await this.userService.findOne({ id: req.user.id });

		const accountNumber = await this.generateAccountNumber(balanceSheetEntry.code, currencyCode);

		const account = this.accountRepository.create({
			name: dto.name,
			user,
			accountNumber,
			type: dto.type,
			status: EAccountStatus.Active,
			currency: dto.currency,
			balance: 0,
			interestRate: dto.type === EAccountType.Credit ? (dto.interestRate ?? 5) : dto.interestRate,
			creditLimit: dto.type === EAccountType.Credit ? (dto.creditLimit ?? null) : null,
		});

		await this.accountRepository.save(account);

		if (dto.type === EAccountType.Checking) {
			const checkingCount = await this.accountRepository.count({
				where: { user: { id: user.id }, type: EAccountType.Checking },
			});
			if (checkingCount === 1) {
				await this.userService.setPrimaryAccount(user.id, account.id);
			}
		}

		return this.findOne(req, { id: account.id });
	}

	async monthlyPayment(req: IAuthRequest, id: string): Promise<Account> {
		const account = await this.findOne(req, { id });

		if (account.type !== EAccountType.Credit) {
			throw new BadRequestException('Ежемесячный платёж доступен только для кредитных счетов');
		}

		if (!account.balance || account.balance <= 0) {
			throw new BadRequestException('Задолженность отсутствует');
		}

		const rate = account.interestRate ?? 5;
		const monthlyInterest = account.balance * (rate / 100) / 12;
		const newBalance = parseFloat((account.balance + monthlyInterest).toFixed(2));

		await this.accountRepository.update({ id }, { balance: newBalance });
		return this.findOne(req, { id });
	}

	async setPrimary(req: IAuthRequest, id: string): Promise<void> {
		await this.findOne(req, { id });
		await this.userService.setPrimaryAccount(req.user.id, id);
	}

	async updateName(req: IAuthRequest, id: string, dto: UpdateAccountNameDto): Promise<Account> {
		return this.update(req, id, dto);
	}

	async updateStatus(req: IAuthRequest, id: string, dto: UpdateAccountStatusDto): Promise<Account> {
		if (dto.status === EAccountStatus.Closed) {
			const account = await this.findOne(req, { id });
			if (account.balance !== 0) {
				throw new BadRequestException('Невозможно закрыть счёт с ненулевым балансом');
			}
		}

		const result = await this.update(req, id, dto);

		if (dto.status === EAccountStatus.Closed) {
			const user = await this.userService.findOne({ id: req.user.id });
			if (user.primaryAccountId === id) {
				const nextDefault = await this.accountRepository.findOne({
					where: {
						user: { id: req.user.id },
						type: EAccountType.Checking,
						status: Not(EAccountStatus.Closed),
					},
					order: { createdAt: 'ASC' },
				});
				await this.userService.setPrimaryAccount(req.user.id, nextDefault?.id ?? null);
			}
		}

		return result;
	}

	async topup(req: IAuthRequest, id: string, dto: TopupAccountDto): Promise<Account> {
		if (dto.password !== this.configService.topupPassword) {
			throw new ForbiddenException('Неверный пароль пополнения');
		}

		const account = await this.findOne(req, { id });

		if (dto.amount === 0) {
			throw new BadRequestException('Сумма пополнения не может быть равна нулю');
		}

		const isCredit = account.type === EAccountType.Credit;
		const newBalance = isCredit ? account.balance - dto.amount : account.balance + dto.amount;
		if (newBalance < 0) {
			throw new BadRequestException(
				isCredit ? 'Сумма погашения превышает задолженность' : 'Недостаточно средств на счёте',
			);
		}

		await this.accountRepository.update({ id }, { balance: newBalance });
		return this.findOne(req, { id });
	}

	private async update(req: IAuthRequest, id: string, dto: Partial<Account>): Promise<Account> {
		const update = await this.accountRepository.update({ id, user: { id: req.user.id } }, dto);

		if (update.affected === 0) {
			throw new NotFoundException('Счёт не найден');
		}

		return this.findOne(req, { id });
	}

	async remove(req: IAuthRequest, id: string): Promise<Account> {
		const account = await this.findOne(req, { id, user: { id: req.user.id } });

		if (account.balance !== 0) {
			throw new BadRequestException('Невозможно удалить счёт с ненулевым балансом');
		}

		return this.accountRepository.remove(account);
	}

	async findOne(req: IAuthRequest, options: FindOptionsWhere<Account>): Promise<Account> {
		const account = await this.accountRepository.findOne({ where: options, relations: ['user'] });

		if (!account || account.user.id !== req.user.id) {
			throw new NotFoundException('Счёт не найден');
		}

		return account;
	}

	async findAll(req: IAuthRequest): Promise<Account[]> {
		return this.accountRepository.find({
			where: { user: { id: req.user.id }, status: Not(EAccountStatus.Closed) },
			order: { createdAt: 'DESC' },
		});
	}

	validateAccountNumber(accountNumber: string, bik: string = BANK_CONFIG.BIK): boolean {
		if (!/^\d{20}$/.test(accountNumber)) return false;

		const balanceSheet = accountNumber.slice(0, 5);
		const currency = accountNumber.slice(5, 8);
		const key = accountNumber.slice(8, 9);
		const branchCode = accountNumber.slice(9, 13);
		const sequential = accountNumber.slice(13, 20);

		const withoutKey = `${balanceSheet}${currency}0${branchCode}${sequential}`;
		return key === this.calculateCheckDigit(withoutKey, bik);
	}

	async generateAccountNumber(balanceSheetCode: string, currencyCode: string): Promise<string> {
		const result = await this.dataSource.query(`SELECT nextval('account_number_seq')`);

		const bik = BANK_CONFIG.BIK;
		const branchCode = BANK_CONFIG.BRANCH_CODE;

		const seq = Number(result[0].nextval);

		const withoutKey = `${balanceSheetCode}${currencyCode}0${branchCode}${seq}`;
		const checkDigit = this.calculateCheckDigit(withoutKey, bik);

		return `${balanceSheetCode}${currencyCode}${checkDigit}${branchCode}${seq}`;
	}

	private calculateCheckDigit(accountWith0: string, bik: string): string {
		const weights = [7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1];
		const calcString = bik.slice(-3) + accountWith0;

		if (calcString.length !== 23) {
			throw new Error(`Неверная длина строки расчёта: ${calcString.length}, ожидается 23`);
		}

		const sum = calcString
			.split('')
			.reduce((acc, digit, i) => acc + parseInt(digit, 10) * weights[i], 0);

		return String(sum % 10);
	}
}
