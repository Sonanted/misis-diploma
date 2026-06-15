import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockApiClient = vi.hoisted(() => ({
	get: vi.fn(),
}));

vi.mock('../client', () => ({ apiClient: mockApiClient }));

import {
	getAccountOperations,
	getCardOperations,
	getOperation,
	getOperations,
	getOperationsSummary,
} from '../operations';

describe('operations API', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('getOperations calls GET /operations with no params by default', async () => {
		const mockData = { items: [], total: 0 };
		mockApiClient.get.mockResolvedValue({ data: mockData });
		const result = await getOperations();
		expect(mockApiClient.get).toHaveBeenCalledWith('/operations', { params: {} });
		expect(result).toEqual(mockData);
	});

	it('getOperations passes query params', async () => {
		const mockData = { items: [], total: 0 };
		mockApiClient.get.mockResolvedValue({ data: mockData });
		await getOperations({ limit: 10, offset: 20, direction: 'incoming' });
		expect(mockApiClient.get).toHaveBeenCalledWith('/operations', {
			params: { limit: 10, offset: 20, direction: 'incoming' },
		});
	});

	it('getOperationsSummary calls GET /operations/summary and returns data', async () => {
		const mockData = { income: 1000, expense: 500 };
		mockApiClient.get.mockResolvedValue({ data: mockData });
		const result = await getOperationsSummary();
		expect(mockApiClient.get).toHaveBeenCalledWith('/operations/summary');
		expect(result).toEqual(mockData);
	});

	it('getOperation calls GET /operations/:id and returns data', async () => {
		const mockData = { id: 'op_1', amount: 500 };
		mockApiClient.get.mockResolvedValue({ data: mockData });
		const result = await getOperation('op_1');
		expect(mockApiClient.get).toHaveBeenCalledWith('/operations/op_1');
		expect(result).toEqual(mockData);
	});

	it('getAccountOperations calls GET /accounts/:id/operations with no params by default', async () => {
		const mockData = { items: [], total: 0 };
		mockApiClient.get.mockResolvedValue({ data: mockData });
		const result = await getAccountOperations('acc_1');
		expect(mockApiClient.get).toHaveBeenCalledWith('/accounts/acc_1/operations', { params: {} });
		expect(result).toEqual(mockData);
	});

	it('getAccountOperations passes query params', async () => {
		const mockData = { items: [], total: 0 };
		mockApiClient.get.mockResolvedValue({ data: mockData });
		await getAccountOperations('acc_1', { limit: 5 });
		expect(mockApiClient.get).toHaveBeenCalledWith('/accounts/acc_1/operations', {
			params: { limit: 5 },
		});
	});

	it('getCardOperations calls GET /cards/:id/operations with no params by default', async () => {
		const mockData = { items: [], total: 0 };
		mockApiClient.get.mockResolvedValue({ data: mockData });
		const result = await getCardOperations('card_1');
		expect(mockApiClient.get).toHaveBeenCalledWith('/cards/card_1/operations', { params: {} });
		expect(result).toEqual(mockData);
	});

	it('getCardOperations passes query params', async () => {
		const mockData = { items: [], total: 0 };
		mockApiClient.get.mockResolvedValue({ data: mockData });
		await getCardOperations('card_1', { direction: 'outgoing' });
		expect(mockApiClient.get).toHaveBeenCalledWith('/cards/card_1/operations', {
			params: { direction: 'outgoing' },
		});
	});
});
