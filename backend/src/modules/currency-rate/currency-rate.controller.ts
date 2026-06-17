import { Controller, Get } from '@nestjs/common';
import { CurrencyRateService } from './currency-rate.service';

@Controller('currency-rates')
export class CurrencyRateController {
	constructor(private readonly currencyRateService: CurrencyRateService) {}

	@Get()
	getRates() {
		return this.currencyRateService.getRates();
	}
}
