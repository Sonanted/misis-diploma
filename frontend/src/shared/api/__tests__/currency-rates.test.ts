import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockApiClient = vi.hoisted(() => ({
	get: vi.fn(),
}));

vi.mock('../client', () => ({ apiClient: mockApiClient }));

import { getCurrencyRates } from '../currency-rates';

describe('currency rates API', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('getCurrencyRates calls GET /currency-rates and returns data', async () => {
		const mockData = {
			rates: { RUB: 1, USD: 0.011, EUR: 0.01 },
			updatedAt: '2026-01-01T00:00:00Z',
		};
		mockApiClient.get.mockResolvedValue({ data: mockData });
		const result = await getCurrencyRates();
		expect(mockApiClient.get).toHaveBeenCalledWith('/currency-rates');
		expect(result).toEqual(mockData);
	});
});
