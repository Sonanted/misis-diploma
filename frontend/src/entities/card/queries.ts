import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
	type ChangeCardPinDto,
	type CreateCardDto,
	type UpdateCardStatusDto,
	changeCardPin,
	createCard,
	getCard,
	getCards,
	getCardPin,
	revealCard,
	updateCardStatus,
} from '@/shared/api/cards';

export const cardKeys = {
	all: ['cards'] as const,
	detail: (id: string) => ['cards', id] as const,
	reveal: (id: string) => ['cards', id, 'reveal'] as const,
	pin: (id: string) => ['cards', id, 'pin'] as const,
};

export function useCards() {
	return useQuery({
		queryKey: cardKeys.all,
		queryFn: getCards,
	});
}

export function useCard(id: string) {
	return useQuery({
		queryKey: cardKeys.detail(id),
		queryFn: () => getCard(id),
		enabled: !!id,
	});
}

export function useCreateCard() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (dto: CreateCardDto) => createCard(dto),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: cardKeys.all });
		},
	});
}

export function useUpdateCardStatus() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, dto }: { id: string; dto: UpdateCardStatusDto }) =>
			updateCardStatus(id, dto),
		onSuccess: (card) => {
			queryClient.invalidateQueries({ queryKey: cardKeys.all });
			queryClient.invalidateQueries({ queryKey: cardKeys.detail(card.id) });
		},
	});
}

export function useRevealCard(id: string, enabled: boolean) {
	return useQuery({
		queryKey: cardKeys.reveal(id),
		queryFn: () => revealCard(id),
		enabled: !!id && enabled,
		gcTime: 0,
	});
}

export function useCardPin(id: string, enabled: boolean) {
	return useQuery({
		queryKey: cardKeys.pin(id),
		queryFn: () => getCardPin(id),
		enabled: !!id && enabled,
		gcTime: 0,
	});
}

export function useChangeCardPin() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, dto }: { id: string; dto: ChangeCardPinDto }) => changeCardPin(id, dto),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: cardKeys.detail(id) });
		},
	});
}
