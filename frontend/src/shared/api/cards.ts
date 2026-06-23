import { apiClient } from './client';
import type { ApiCard, ApiCardDetail, ApiCardPin, ApiCardReveal, ECardStatus } from './types';

export interface CreateCardDto {
	name: string;
	accountId: string;
}

export const getCards = (): Promise<ApiCard[]> =>
	apiClient.get<ApiCard[]>('/cards').then((r) => r.data);

export const getCard = (id: string): Promise<ApiCardDetail> =>
	apiClient.get<ApiCardDetail>(`/cards/${id}`).then((r) => r.data);

export const createCard = (dto: CreateCardDto): Promise<ApiCardDetail> =>
	apiClient.post<ApiCardDetail>('/cards', dto).then((r) => r.data);

export interface UpdateCardStatusDto {
	status: ECardStatus;
}

export const updateCardStatus = (id: string, dto: UpdateCardStatusDto): Promise<ApiCardDetail> =>
	apiClient.patch<ApiCardDetail>(`/cards/${id}/status`, dto).then((r) => r.data);

export interface ChangeCardPinDto {
	pin: string;
}

export const changeCardPin = (id: string, dto: ChangeCardPinDto): Promise<void> =>
	apiClient.patch(`/cards/${id}/pin`, dto).then(() => undefined);

export const revealCard = (id: string): Promise<ApiCardReveal> =>
	apiClient.get<ApiCardReveal>(`/cards/${id}/reveal`).then((r) => r.data);

export const getCardPin = (id: string): Promise<ApiCardPin> =>
	apiClient.get<ApiCardPin>(`/cards/${id}/pin`).then((r) => r.data);
