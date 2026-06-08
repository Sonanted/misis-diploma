import { apiClient } from './client';

export interface BankInfo {
	bik: string;
	name: string;
}

export const getBankInfo = (): Promise<BankInfo> =>
	apiClient.get<BankInfo>('/accounts/bank-info').then((r) => r.data);
