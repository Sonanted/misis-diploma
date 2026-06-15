import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockApiClient = vi.hoisted(() => ({
	get: vi.fn(),
	post: vi.fn(),
}));

vi.mock('../client', () => ({ apiClient: mockApiClient }));

import {
	requestPasswordReset,
	resetPassword,
	signin,
	signup,
	verifyResetCode,
} from '../auth';

describe('auth API', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('signin calls POST /auth/signin and returns data', async () => {
		const dto = { phone: '+79001234567', password: 'pass' };
		const mockData = { access_token: 'token_123' };
		mockApiClient.post.mockResolvedValue({ data: mockData });
		const result = await signin(dto);
		expect(mockApiClient.post).toHaveBeenCalledWith('/auth/signin', dto);
		expect(result).toEqual(mockData);
	});

	it('signup calls POST /auth/signup and returns data', async () => {
		const dto = {
			firstName: 'John',
			lastName: 'Doe',
			phone: '+79001234567',
			email: 'john@example.com',
			password: 'pass',
		};
		const mockData = { access_token: 'token_123' };
		mockApiClient.post.mockResolvedValue({ data: mockData });
		const result = await signup(dto);
		expect(mockApiClient.post).toHaveBeenCalledWith('/auth/signup', dto);
		expect(result).toEqual(mockData);
	});

	it('requestPasswordReset calls POST /auth/forgot-password/request and returns data', async () => {
		const mockData = { code: '1234' };
		mockApiClient.post.mockResolvedValue({ data: mockData });
		const result = await requestPasswordReset('+79001234567');
		expect(mockApiClient.post).toHaveBeenCalledWith('/auth/forgot-password/request', {
			phone: '+79001234567',
		});
		expect(result).toEqual(mockData);
	});

	it('verifyResetCode calls POST /auth/forgot-password/verify and returns undefined', async () => {
		mockApiClient.post.mockResolvedValue({});
		const result = await verifyResetCode('+79001234567', '1234');
		expect(mockApiClient.post).toHaveBeenCalledWith('/auth/forgot-password/verify', {
			phone: '+79001234567',
			code: '1234',
		});
		expect(result).toBeUndefined();
	});

	it('resetPassword calls POST /auth/forgot-password/reset and returns undefined', async () => {
		mockApiClient.post.mockResolvedValue({});
		const result = await resetPassword('+79001234567', '1234', 'newPass123');
		expect(mockApiClient.post).toHaveBeenCalledWith('/auth/forgot-password/reset', {
			phone: '+79001234567',
			code: '1234',
			newPassword: 'newPass123',
		});
		expect(result).toBeUndefined();
	});
});
