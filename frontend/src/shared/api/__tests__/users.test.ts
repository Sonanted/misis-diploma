import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockApiClient = vi.hoisted(() => ({
	get: vi.fn(),
	patch: vi.fn(),
}));

vi.mock('../client', () => ({ apiClient: mockApiClient }));

import { changePassword, getMe, updateMe } from '../users';

describe('users API', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('getMe calls GET /users/me and returns data', async () => {
		const mockData = { id: 'usr_1', firstName: 'John', phone: '+79001234567' };
		mockApiClient.get.mockResolvedValue({ data: mockData });
		const result = await getMe();
		expect(mockApiClient.get).toHaveBeenCalledWith('/users/me');
		expect(result).toEqual(mockData);
	});

	it('updateMe calls PATCH /users/me and returns data', async () => {
		const dto = { firstName: 'Jane', email: 'jane@example.com' };
		const mockData = { id: 'usr_1', ...dto };
		mockApiClient.patch.mockResolvedValue({ data: mockData });
		const result = await updateMe(dto);
		expect(mockApiClient.patch).toHaveBeenCalledWith('/users/me', dto);
		expect(result).toEqual(mockData);
	});

	it('changePassword calls PATCH /users/me/password and returns undefined', async () => {
		mockApiClient.patch.mockResolvedValue({});
		const dto = { currentPassword: 'old', newPassword: 'new' };
		const result = await changePassword(dto);
		expect(mockApiClient.patch).toHaveBeenCalledWith('/users/me/password', dto);
		expect(result).toBeUndefined();
	});
});
