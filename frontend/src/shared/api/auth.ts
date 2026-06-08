import type { AuthResponse } from './types';
import { apiClient } from './client';

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
