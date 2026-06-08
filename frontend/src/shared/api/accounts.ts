import { apiClient } from './client';
import type { ApiAccount, EAccountCurrency, EAccountStatus, EAccountType } from './types';

export interface CreateAccountDto {
	name: string;
	type: EAccountType;
	currency: EAccountCurrency;
	interestRate?: number;
	creditLimit?: number;
}

export interface UpdateAccountNameDto {
	name: string;
}

export interface UpdateAccountStatusDto {
	status: EAccountStatus;
}

export const getAccounts = (): Promise<ApiAccount[]> =>
	apiClient.get<ApiAccount[]>('/accounts').then((r) => r.data);

export const getAccount = (id: string): Promise<ApiAccount> =>
	apiClient.get<ApiAccount>(`/accounts/${id}`).then((r) => r.data);

export const createAccount = (dto: CreateAccountDto): Promise<ApiAccount> =>
	apiClient.post<ApiAccount>('/accounts', dto).then((r) => r.data);

export const updateAccountName = (id: string, dto: UpdateAccountNameDto): Promise<ApiAccount> =>
	apiClient.patch<ApiAccount>(`/accounts/${id}/name`, dto).then((r) => r.data);

export const updateAccountStatus = (id: string, dto: UpdateAccountStatusDto): Promise<ApiAccount> =>
	apiClient.patch<ApiAccount>(`/accounts/${id}/status`, dto).then((r) => r.data);

export interface TopupAccountDto {
	amount: number;
	password: string;
}

export const topupAccount = (id: string, dto: TopupAccountDto): Promise<ApiAccount> =>
	apiClient.post<ApiAccount>(`/accounts/${id}/topup`, dto).then((r) => r.data);

export const setPrimaryAccount = (id: string): Promise<void> =>
	apiClient.patch(`/accounts/${id}/primary`).then(() => undefined);

export const deleteAccount = (id: string): Promise<void> =>
	apiClient.delete(`/accounts/${id}`).then(() => undefined);

export const monthlyPayment = (id: string): Promise<ApiAccount> =>
	apiClient.post<ApiAccount>(`/accounts/${id}/monthly-payment`).then((r) => r.data);
