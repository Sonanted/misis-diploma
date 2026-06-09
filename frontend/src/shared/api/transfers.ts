import { apiClient } from './client';

export interface CreateTransferDto {
	fromAccountId: string;
	method: 'account' | 'phone' | 'card';
	recipientIdentifier: string;
	amount: number;
	description?: string;
}

export interface TransferResult {
	fromAccountId: string;
	toAccountId: string;
	amount: number;
}

export const createTransfer = (dto: CreateTransferDto): Promise<TransferResult> =>
	apiClient.post<TransferResult>('/transfers', dto).then((r) => r.data);
