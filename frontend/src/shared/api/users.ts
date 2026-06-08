import type { ApiUser } from './types';
import { apiClient } from './client';

export interface UpdateUserDto {
	firstName?: string;
	lastName?: string;
	middleName?: string;
	email?: string;
	phone?: string;
}

export interface ChangePasswordDto {
	currentPassword: string;
	newPassword: string;
}

export const getMe = (): Promise<ApiUser> =>
	apiClient.get<ApiUser>('/users/me').then((r) => r.data);

export const updateMe = (dto: UpdateUserDto): Promise<ApiUser> =>
	apiClient.patch<ApiUser>('/users/me', dto).then((r) => r.data);

export const changePassword = (dto: ChangePasswordDto): Promise<void> =>
	apiClient.patch('/users/me/password', dto).then(() => undefined);
