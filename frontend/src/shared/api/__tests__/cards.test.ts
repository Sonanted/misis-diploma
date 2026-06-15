import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockApiClient = vi.hoisted(() => ({
	get: vi.fn(),
	post: vi.fn(),
	patch: vi.fn(),
}));

vi.mock('../client', () => ({ apiClient: mockApiClient }));

import { changeCardPin, createCard, getCard, getCards, updateCardStatus } from '../cards';

describe('cards API', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('getCards calls GET /cards and returns data', async () => {
		const mockData = [{ id: 'card_1', name: 'My Card' }];
		mockApiClient.get.mockResolvedValue({ data: mockData });
		const result = await getCards();
		expect(mockApiClient.get).toHaveBeenCalledWith('/cards');
		expect(result).toEqual(mockData);
	});

	it('getCard calls GET /cards/:id and returns data', async () => {
		const mockData = { id: 'card_1', name: 'My Card', fullNumber: '4111111111111234' };
		mockApiClient.get.mockResolvedValue({ data: mockData });
		const result = await getCard('card_1');
		expect(mockApiClient.get).toHaveBeenCalledWith('/cards/card_1');
		expect(result).toEqual(mockData);
	});

	it('createCard calls POST /cards and returns data', async () => {
		const dto = { name: 'New Card', accountId: 'acc_1' };
		const mockData = { id: 'card_2', ...dto };
		mockApiClient.post.mockResolvedValue({ data: mockData });
		const result = await createCard(dto);
		expect(mockApiClient.post).toHaveBeenCalledWith('/cards', dto);
		expect(result).toEqual(mockData);
	});

	it('updateCardStatus calls PATCH /cards/:id/status and returns data', async () => {
		const dto = { status: 'Locked' as const };
		const mockData = { id: 'card_1', status: 'Locked' };
		mockApiClient.patch.mockResolvedValue({ data: mockData });
		const result = await updateCardStatus('card_1', dto);
		expect(mockApiClient.patch).toHaveBeenCalledWith('/cards/card_1/status', dto);
		expect(result).toEqual(mockData);
	});

	it('changeCardPin calls PATCH /cards/:id/pin and returns undefined', async () => {
		mockApiClient.patch.mockResolvedValue({});
		const result = await changeCardPin('card_1', { pin: '4321' });
		expect(mockApiClient.patch).toHaveBeenCalledWith('/cards/card_1/pin', { pin: '4321' });
		expect(result).toBeUndefined();
	});
});
