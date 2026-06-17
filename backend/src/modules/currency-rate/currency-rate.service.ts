import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import axios from 'axios';
import { EAccountCurrency } from 'src/shared/enums/EAccountCurrency';

type RateMap = Record<EAccountCurrency, number>;

interface RateCache {
	rates: RateMap;
	fetchedAt: Date;
}

const CBR_URL = 'https://www.cbr.ru/scripts/XML_daily.asp';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

@Injectable()
export class CurrencyRateService {
	private readonly logger = new Logger(CurrencyRateService.name);
	private cache: RateCache | null = null;

	async getRates(): Promise<{ rates: RateMap; updatedAt: string }> {
		if (!this.isCacheFresh()) {
			await this.fetchFromCbr();
		}
		return { rates: this.cache!.rates, updatedAt: this.cache!.fetchedAt.toISOString() };
	}

	async convert(amount: number, from: EAccountCurrency, to: EAccountCurrency): Promise<number> {
		if (from === to) return amount;
		if (!this.isCacheFresh()) await this.fetchFromCbr();
		const rates = this.cache!.rates;
		const inRub = amount * rates[from];
		return parseFloat((inRub / rates[to]).toFixed(2));
	}

	private isCacheFresh(): boolean {
		if (!this.cache) return false;
		return Date.now() - this.cache.fetchedAt.getTime() < CACHE_TTL_MS;
	}

	private async fetchFromCbr(): Promise<void> {
		this.logger.log('Fetching exchange rates from CBR...');
		try {
			const { data: xml } = await axios.get<string>(CBR_URL, {
				responseType: 'text',
				timeout: 10_000,
			});

			this.cache = {
				rates: {
					RUB: 1,
					USD: this.parseRate(xml, 'USD'),
					EUR: this.parseRate(xml, 'EUR'),
				},
				fetchedAt: new Date(),
			};

			this.logger.log(
				`Rates updated: USD=${this.cache.rates.USD}, EUR=${this.cache.rates.EUR}`,
			);
		} catch (err) {
			this.logger.error('Failed to fetch CBR rates', err);
			if (!this.cache) {
				throw new ServiceUnavailableException('Не удалось получить курсы валют от ЦБ РФ');
			}
			this.logger.warn('Using stale cached rates due to CBR fetch failure');
		}
	}

	private parseRate(xml: string, charCode: string): number {
		const match = new RegExp(
			`<CharCode>${charCode}</CharCode>\\s*<Nominal>(\\d+)</Nominal>[\\s\\S]*?<Value>([\\d,]+)</Value>`,
		).exec(xml);
		if (!match) throw new Error(`Rate for ${charCode} not found in CBR response`);
		const nominal = parseInt(match[1], 10);
		const value = parseFloat(match[2].replace(',', '.'));
		return parseFloat((value / nominal).toFixed(4));
	}
}
