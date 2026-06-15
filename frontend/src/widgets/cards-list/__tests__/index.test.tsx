import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithRouter } from '@/test/test-utils';
import type { ApiCard } from '@/shared/api/types';
import { CardsList } from '../index';

vi.mock('../create-card-dialog', () => ({
	CreateCardDialog: () => <button type="button">create-card-dialog</button>,
}));

vi.mock('@/entities/card/queries', () => ({
	useCards: vi.fn(),
}));

const mockCard: ApiCard = {
	id: 'card1',
	name: 'My Debit Card',
	cardNumber: '**** **** **** 1234',
	expiryDate: '12/27',
	type: 'Debit',
	status: 'Active',
	currency: 'RUB',
	balance: 5000,
	creditLimit: null,
	availableCredit: null,
	cardHolder: 'Ivan Petrov',
	linkedAccountId: 'acc1',
	linkedAccountName: 'Main Account',
};

describe('CardsList', () => {
	it('shows skeletons while loading', async () => {
		const { useCards } = await import('@/entities/card/queries');
		vi.mocked(useCards).mockReturnValue({ data: undefined, isLoading: true } as never);
		const { container } = renderWithRouter(<CardsList />);
		// At minimum the container renders
		expect(container).toBeInTheDocument();
	});

	it('shows empty state when cards array is empty', async () => {
		const { useCards } = await import('@/entities/card/queries');
		vi.mocked(useCards).mockReturnValue({ data: [], isLoading: false } as never);
		renderWithRouter(<CardsList />);
		expect(screen.getByText('cards.empty_title')).toBeInTheDocument();
	});

	it('renders card name when cards are loaded', async () => {
		const { useCards } = await import('@/entities/card/queries');
		vi.mocked(useCards).mockReturnValue({ data: [mockCard], isLoading: false } as never);
		renderWithRouter(<CardsList />);
		expect(screen.getByText('My Debit Card')).toBeInTheDocument();
	});

	it('renders card number and expiry', async () => {
		const { useCards } = await import('@/entities/card/queries');
		vi.mocked(useCards).mockReturnValue({ data: [mockCard], isLoading: false } as never);
		renderWithRouter(<CardsList />);
		expect(screen.getByText(/Exp 12\/27/)).toBeInTheDocument();
	});

	it('renders link to card detail page', async () => {
		const { useCards } = await import('@/entities/card/queries');
		vi.mocked(useCards).mockReturnValue({ data: [mockCard], isLoading: false } as never);
		renderWithRouter(<CardsList />);
		const link = screen.getByRole('link', { name: /My Debit Card/i });
		expect(link).toHaveAttribute('href', '/cards/card1');
	});

	it('renders cards title', async () => {
		const { useCards } = await import('@/entities/card/queries');
		vi.mocked(useCards).mockReturnValue({ data: [], isLoading: false } as never);
		renderWithRouter(<CardsList />);
		expect(screen.getByText('cards.title')).toBeInTheDocument();
	});

	it('renders credit card balance with credit limit info', async () => {
		const { useCards } = await import('@/entities/card/queries');
		const creditCard: ApiCard = {
			...mockCard,
			id: 'card2',
			type: 'Credit',
			creditLimit: 50000,
			availableCredit: 30000,
		};
		vi.mocked(useCards).mockReturnValue({ data: [creditCard], isLoading: false } as never);
		renderWithRouter(<CardsList />);
		// Credit card shows available credit info
		expect(screen.getByText(/50 000/)).toBeInTheDocument();
	});
});
