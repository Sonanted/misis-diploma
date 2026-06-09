import { apiClient } from './client';
import type { ApiOperation, PaginatedOperations } from './types';

export interface OperationsQuery {
	limit?: number;
	offset?: number;
}

export const getOperations = (query: OperationsQuery = {}): Promise<PaginatedOperations> =>
	apiClient.get<PaginatedOperations>('/operations', { params: query }).then((r) => r.data);

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
