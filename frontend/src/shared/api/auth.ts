import { apiClient } from './client';
import type { AuthResponse } from './types';

export interface SigninDto {
	phone: string;
	password: string;
}

export interface SignupDto {
	firstName: string;
	lastName: string;
	middleName?: string;
	phone: string;
	email: string;
	password: string;
}

export const signin = (dto: SigninDto): Promise<AuthResponse> =>
	apiClient.post<AuthResponse>('/auth/signin', dto).then((r) => r.data);

export const signup = (dto: SignupDto): Promise<AuthResponse> =>
	apiClient.post<AuthResponse>('/auth/signup', dto).then((r) => r.data);

export const requestPasswordReset = (phone: string): Promise<{ code: string | null }> =>
	apiClient.post<{ code: string | null }>('/auth/forgot-password/request', { phone }).then((r) => r.data);

export const verifyResetCode = (phone: string, code: string): Promise<void> =>
	apiClient.post('/auth/forgot-password/verify', { phone, code }).then(() => undefined);

export const resetPassword = (phone: string, code: string, newPassword: string): Promise<void> =>
	apiClient.post('/auth/forgot-password/reset', { phone, code, newPassword }).then(() => undefined);
