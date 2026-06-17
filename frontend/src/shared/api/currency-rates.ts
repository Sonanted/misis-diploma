import { apiClient } from './client';
import type { EAccountCurrency } from './types';

export interface CurrencyRates {
	rates: Record<EAccountCurrency, number>;
	updatedAt: string;
}

export const getCurrencyRates = (): Promise<CurrencyRates> =>
	apiClient.get<CurrencyRates>('/currency-rates').then((r) => r.data);
