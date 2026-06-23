import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useAccount } from '@/entities/account/queries';
import { useCard } from '@/entities/card/queries';
import { useOperation } from '@/entities/operation/queries';
import { AccountBreadcrumb, CardBreadcrumb, OperationBreadcrumb } from '../breadcrumbs';

const TEST_ACCOUNT_ID = 'acc_1';
const TEST_CARD_ID = 'card_1';
const TEST_OPERATION_ID = 'op_1';

vi.mock('@/entities/account/queries', () => ({
	useAccount: vi.fn(() => ({ data: { name: 'My Account' } })),
}));

vi.mock('@/entities/card/queries', () => ({
	useCard: vi.fn(() => ({ data: { name: 'My Card' } })),
}));

vi.mock('@/entities/operation/queries', () => ({
	useOperation: vi.fn(() => ({ data: { type: 'incoming' } })),
}));

describe('AccountBreadcrumb', () => {
	it('renders account name when data is available', () => {
		render(<AccountBreadcrumb id={TEST_ACCOUNT_ID} />);
		expect(screen.getByText('My Account')).toBeInTheDocument();
	});

	it('renders id as fallback when data is undefined', () => {
		vi.mocked(useAccount).mockReturnValueOnce({ data: undefined } as ReturnType<typeof useAccount>);
		render(<AccountBreadcrumb id={TEST_ACCOUNT_ID} />);
		expect(screen.getByText(TEST_ACCOUNT_ID)).toBeInTheDocument();
	});

	it('renders empty when id is undefined and data is undefined', () => {
		vi.mocked(useAccount).mockReturnValueOnce({ data: undefined } as ReturnType<typeof useAccount>);
		const { container } = render(<AccountBreadcrumb />);
		expect(container.textContent).toBe('');
	});
});

describe('CardBreadcrumb', () => {
	it('renders card name when data is available', () => {
		render(<CardBreadcrumb id={TEST_CARD_ID} />);
		expect(screen.getByText('My Card')).toBeInTheDocument();
	});

	it('renders id as fallback when data is undefined', () => {
		vi.mocked(useCard).mockReturnValueOnce({ data: undefined } as ReturnType<typeof useCard>);
		render(<CardBreadcrumb id={TEST_CARD_ID} />);
		expect(screen.getByText(TEST_CARD_ID)).toBeInTheDocument();
	});
});

describe('OperationBreadcrumb', () => {
	it('renders operation type when data is available', () => {
		render(<OperationBreadcrumb id={TEST_OPERATION_ID} />);
		expect(screen.getByText('incoming')).toBeInTheDocument();
	});

	it('renders id as fallback when data is undefined', () => {
		vi.mocked(useOperation).mockReturnValueOnce({ data: undefined } as ReturnType<typeof useOperation>);
		render(<OperationBreadcrumb id={TEST_OPERATION_ID} />);
		expect(screen.getByText(TEST_OPERATION_ID)).toBeInTheDocument();
	});

	it('renders empty when id is undefined and data is undefined', () => {
		vi.mocked(useOperation).mockReturnValueOnce({ data: undefined } as ReturnType<typeof useOperation>);
		const { container } = render(<OperationBreadcrumb />);
		expect(container.textContent).toBe('');
	});
});
