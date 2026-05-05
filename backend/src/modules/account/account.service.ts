import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EAccountStatus } from 'src/shared/enums/EAccountStatus';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';
import { IAuthRequest } from '../auth/interfaces/IAuthRequest';
import { UserService } from '../user/user.service';
import { BALANCE_SHEET_ACCOUNTS, BANK_CONFIG, CURRENCY_CODES } from './account.contants';
import { CreateAccountDto } from './dto/create-account.dto';
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
			interestRate: dto.interestRate,
		});

		await this.accountRepository.save(account);

		return this.findOne(req, { id: account.id });
	}

	async updateName(req: IAuthRequest, id: string, dto: UpdateAccountNameDto): Promise<Account> {
		return this.update(req, id, dto);
	}

	async updateStatus(req: IAuthRequest, id: string, dto: UpdateAccountStatusDto): Promise<Account> {
		return this.update(req, id, dto);
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

	async findAll(): Promise<Account[]> {
		return this.accountRepository.find({
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
