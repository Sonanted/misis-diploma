import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accountKeys } from '@/entities/account/queries';
import { operationKeys } from '@/entities/operation/queries';
import { createTransfer, type CreateTransferDto } from '@/shared/api/transfers';

export function useTransfer() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (dto: CreateTransferDto) => createTransfer(dto),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: accountKeys.all });
			queryClient.invalidateQueries({ queryKey: operationKeys.all });
		},
	});
}
