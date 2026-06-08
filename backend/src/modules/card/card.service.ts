import * as crypto from 'node:crypto';
import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EAccountCurrency } from 'src/shared/enums/EAccountCurrency';
import { EAccountStatus } from 'src/shared/enums/EAccountStatus';
import { EAccountType } from 'src/shared/enums/EAccountType';
import { ECardStatus } from 'src/shared/enums/ECardStatus';
import { ECardType } from 'src/shared/enums/ECardType';
import { DataSource, Not, Repository } from 'typeorm';
import { AccountService } from '../account/account.service';
import { IAuthRequest } from '../auth/interfaces/IAuthRequest';
import { ChangeCardPinDto } from './dto/change-card-pin.dto';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardStatusDto } from './dto/update-card-status.dto';
import { Card } from './entities/card.entity';

const CARD_BIN = '220099';

export interface CardListItem {
	id: string;
	name: string;
	cardNumber: string;
	expiryDate: string;
	type: ECardType;
	status: ECardStatus;
	currency: EAccountCurrency;
	balance: number;
	creditLimit: number | null;
	availableCredit: number | null;
	cardHolder: string;
	linkedAccountId: string;
	linkedAccountName: string;
}

export interface CardDetail extends CardListItem {
	fullNumber: string;
	cvv: string;
	pin: string;
}

@Injectable()
export class CardService {
	constructor(
		@InjectRepository(Card)
		private readonly cardRepository: Repository<Card>,
		private readonly dataSource: DataSource,
		private readonly accountService: AccountService,
	) {}

	async findAll(req: IAuthRequest): Promise<CardListItem[]> {
		const cards = await this.cardRepository.find({
			where: { user: { id: req.user.id }, status: Not(ECardStatus.Closed) },
			relations: ['account', 'user'],
			order: { createdAt: 'DESC' },
		});
		return cards.map((card) => this.toListItem(card));
	}

	async findOne(req: IAuthRequest, id: string): Promise<CardDetail> {
		const card = await this.loadCard(req, id);
		return this.toDetail(card);
	}

	async create(req: IAuthRequest, dto: CreateCardDto): Promise<CardDetail> {
		const account = await this.accountService.findOne(req, { id: dto.accountId });

		if (account.status !== EAccountStatus.Active) {
			throw new BadRequestException('Нельзя выпустить карту для неактивного счёта');
		}

		const cardType = account.type === EAccountType.Credit ? ECardType.Credit : ECardType.Debit;

		if (cardType === ECardType.Debit && account.type !== EAccountType.Checking) {
			throw new BadRequestException('Дебетовая карта может быть привязана только к расчётному счёту');
		}
		if (cardType === ECardType.Credit && account.type !== EAccountType.Credit) {
			throw new BadRequestException('Кредитная карта может быть привязана только к кредитному счёту');
		}
		const cardNumber = await this.generateCardNumber();
		const cvv = crypto.randomInt(100, 999).toString();
		const pin = crypto.randomInt(1000, 9999).toString();

		const now = new Date();
		const expiryYear = (now.getFullYear() + 3) % 100;
		const expiryMonth = (now.getMonth() + 1).toString().padStart(2, '0');
		const expiryDate = `${expiryMonth}/${expiryYear.toString().padStart(2, '0')}`;

		const card = this.cardRepository.create({
			name: dto.name,
			user: account.user,
			account,
			cardNumber,
			expiryDate,
			cvv,
			pin,
			type: cardType,
			status: ECardStatus.Active,
		});

		await this.cardRepository.save(card);
		return this.findOne(req, card.id);
	}

	async updateStatus(req: IAuthRequest, id: string, dto: UpdateCardStatusDto): Promise<CardDetail> {
		const card = await this.loadCard(req, id);

		if (card.status === ECardStatus.Closed) {
			throw new ForbiddenException('Нельзя изменить статус закрытой карты');
		}

		await this.cardRepository.update(id, { status: dto.status });
		return this.findOne(req, id);
	}

	async changePin(req: IAuthRequest, id: string, dto: ChangeCardPinDto): Promise<void> {
		await this.loadCard(req, id);
		await this.cardRepository.update(id, { pin: dto.pin });
	}

	private async loadCard(req: IAuthRequest, id: string): Promise<Card> {
		const card = await this.cardRepository.findOne({
			where: { id, user: { id: req.user.id } },
			relations: ['account', 'user'],
		});
		if (!card) throw new NotFoundException('Карта не найдена');
		return card;
	}

	private maskCardNumber(raw: string): string {
		return `**** **** **** ${raw.slice(-4)}`;
	}

	private formatCardNumber(raw: string): string {
		return raw.replace(/(.{4})/g, '$1 ').trim();
	}

	private cardHolderName(card: Card): string {
		return `${card.user.firstName} ${card.user.lastName}`;
	}

	private toListItem(card: Card): CardListItem {
		const creditLimit = card.account.creditLimit ?? null;
		const availableCredit = creditLimit !== null ? creditLimit - card.account.balance : null;
		return {
			id: card.id,
			name: card.name,
			cardNumber: this.maskCardNumber(card.cardNumber),
			expiryDate: card.expiryDate,
			type: card.type,
			status: card.status,
			currency: card.account.currency,
			balance: card.account.balance,
			creditLimit,
			availableCredit,
			cardHolder: this.cardHolderName(card),
			linkedAccountId: card.account.id,
			linkedAccountName: card.account.name,
		};
	}

	private toDetail(card: Card): CardDetail {
		return {
			...this.toListItem(card),
			fullNumber: this.formatCardNumber(card.cardNumber),
			cvv: card.cvv,
			pin: card.pin,
		};
	}

	private async generateCardNumber(): Promise<string> {
		const result = await this.dataSource.query(`SELECT nextval('card_number_seq')`);
		const seq = Number(result[0].nextval);
		const individual = seq.toString().padStart(9, '0');
		const prefix = `${CARD_BIN}${individual}`;
		const checkDigit = this.calculateLuhnDigit(prefix);
		return `${prefix}${checkDigit}`;
	}

	private calculateLuhnDigit(prefix: string): string {
		let sum = 0;
		for (let i = 0; i < prefix.length; i++) {
			let digit = parseInt(prefix[i], 10);
			// Even indices (0, 2, 4, ...) are doubled in a 16-digit card number
			// where the check digit occupies the rightmost position
			if (i % 2 === 0) {
				digit *= 2;
				if (digit > 9) digit -= 9;
			}
			sum += digit;
		}
		return String((10 - (sum % 10)) % 10);
	}
}
