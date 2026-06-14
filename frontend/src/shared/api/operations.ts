import { apiClient } from './client';
import type { ApiOperation, MonthlySummary, PaginatedOperations } from './types';

export interface OperationsQuery {
	limit?: number;
	offset?: number;
	direction?: 'incoming' | 'outgoing' | 'internal' | 'other';
	type?: string;
	dateFrom?: string;
	dateTo?: string;
}

export const getOperations = (query: OperationsQuery = {}): Promise<PaginatedOperations> =>
	apiClient.get<PaginatedOperations>('/operations', { params: query }).then((r) => r.data);

export const getOperationsSummary = (): Promise<MonthlySummary> =>
	apiClient.get<MonthlySummary>('/operations/summary').then((r) => r.data);

export const getOperation = (id: string): Promise<ApiOperation> =>
	apiClient.get<ApiOperation>(`/operations/${id}`).then((r) => r.data);

export const getAccountOperations = (
	accountId: string,
	query: OperationsQuery = {},
): Promise<PaginatedOperations> =>
	apiClient
		.get<PaginatedOperations>(`/accounts/${accountId}/operations`, { params: query })
		.then((r) => r.data);

export const getCardOperations = (
	cardId: string,
	query: OperationsQuery = {},
): Promise<PaginatedOperations> =>
	apiClient
		.get<PaginatedOperations>(`/cards/${cardId}/operations`, { params: query })
		.then((r) => r.data);
