import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/entities/user/model';
import {
	createAccount,
	deleteAccount,
	getAccount,
	getAccounts,
	monthlyPayment,
	setPrimaryAccount,
	topupAccount,
	updateAccountStatus,
	type CreateAccountDto,
	type TopupAccountDto,
	type UpdateAccountStatusDto,
} from '@/shared/api/accounts';
import { getBankInfo } from '@/shared/api/config';

export const accountKeys = {
	all: ['accounts'] as const,
	detail: (id: string) => ['accounts', id] as const,
};

export const bankInfoKeys = {
	all: ['bank-info'] as const,
};

export function useAccounts() {
	return useQuery({
		queryKey: accountKeys.all,
		queryFn: getAccounts,
	});
}

export function useAccount(id: string) {
	return useQuery({
		queryKey: accountKeys.detail(id),
		queryFn: () => getAccount(id),
		enabled: !!id,
	});
}

export function useCreateAccount() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (dto: CreateAccountDto) => createAccount(dto),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: accountKeys.all });
			queryClient.invalidateQueries({ queryKey: ['me'] });
		},
	});
}

export function useTopupAccount() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, dto }: { id: string; dto: TopupAccountDto }) => topupAccount(id, dto),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: accountKeys.detail(id) });
			queryClient.invalidateQueries({ queryKey: accountKeys.all });
		},
	});
}

export function useSetPrimaryAccount() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => setPrimaryAccount(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['me'] });
		},
	});
}

export function useUpdateAccountStatus() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, dto }: { id: string; dto: UpdateAccountStatusDto }) =>
			updateAccountStatus(id, dto),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: accountKeys.all });
			queryClient.invalidateQueries({ queryKey: accountKeys.detail(id) });
		},
	});
}

export function useDeleteAccount() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => deleteAccount(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: accountKeys.all });
		},
	});
}

export function useMonthlyPayment() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => monthlyPayment(id),
		onSuccess: (_, id) => {
			queryClient.invalidateQueries({ queryKey: accountKeys.detail(id) });
			queryClient.invalidateQueries({ queryKey: accountKeys.all });
		},
	});
}

export function useBankInfo() {
	const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
	return useQuery({
		queryKey: bankInfoKeys.all,
		queryFn: getBankInfo,
		enabled: isAuthenticated,
		staleTime: Number.POSITIVE_INFINITY,
	});
}
