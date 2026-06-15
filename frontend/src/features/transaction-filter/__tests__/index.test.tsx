import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { TransactionFilter } from '../index';

vi.mock('@/shared/ui/calendar', () => ({
	Calendar: () => <div>Calendar</div>,
}));

vi.mock('@/shared/ui/popover', () => ({
	Popover: ({ children }: { children: ReactNode }) => <div>{children}</div>,
	PopoverTrigger: ({ children }: { children: ReactNode }) => (
		<button type="button">{children}</button>
	),
	PopoverContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

const defaultProps = {
	dateRange: undefined,
	onDateRangeChange: vi.fn(),
	isFiltered: false,
	onReset: vi.fn(),
};

describe('TransactionFilter', () => {
	it('renders filter trigger button', () => {
		const { container } = render(<TransactionFilter {...defaultProps} />);
		expect(container.querySelector('button')).toBeInTheDocument();
	});

	it('renders calendar component', () => {
		render(<TransactionFilter {...defaultProps} />);
		expect(screen.getByText('Calendar')).toBeInTheDocument();
	});

	it('renders filter title', () => {
		render(<TransactionFilter {...defaultProps} />);
		expect(screen.getByText('transaction_filter.title')).toBeInTheDocument();
	});

	it('renders period label', () => {
		render(<TransactionFilter {...defaultProps} />);
		expect(screen.getByText('transaction_filter.period')).toBeInTheDocument();
	});

	it('does not show reset button when not filtered', () => {
		render(<TransactionFilter {...defaultProps} isFiltered={false} />);
		expect(screen.queryByText('transaction_filter.reset')).not.toBeInTheDocument();
	});

	it('shows reset button when filtered', () => {
		render(<TransactionFilter {...defaultProps} isFiltered={true} />);
		expect(screen.getByText('transaction_filter.reset')).toBeInTheDocument();
	});

	it('calls onReset when reset button clicked', async () => {
		const onReset = vi.fn();
		render(<TransactionFilter {...defaultProps} isFiltered={true} onReset={onReset} />);
		await userEvent.click(screen.getByText('transaction_filter.reset'));
		expect(onReset).toHaveBeenCalled();
	});

	it('renders type options when provided', () => {
		const typeOptions = [
			{ value: 'all', label: 'All' },
			{ value: 'incoming', label: 'Incoming' },
		];
		render(
			<TransactionFilter
				{...defaultProps}
				typeOptions={typeOptions}
				typeFilter="all"
				onTypeFilterChange={vi.fn()}
			/>,
		);
		expect(screen.getByText('All')).toBeInTheDocument();
		expect(screen.getByText('Incoming')).toBeInTheDocument();
	});

	it('calls onTypeFilterChange when type button clicked', async () => {
		const onTypeFilterChange = vi.fn();
		const typeOptions = [
			{ value: 'all', label: 'All' },
			{ value: 'incoming', label: 'Incoming' },
		];
		render(
			<TransactionFilter
				{...defaultProps}
				typeOptions={typeOptions}
				typeFilter="all"
				onTypeFilterChange={onTypeFilterChange}
			/>,
		);
		await userEvent.click(screen.getByText('Incoming'));
		expect(onTypeFilterChange).toHaveBeenCalledWith('incoming');
	});

	it('does not render type options section when typeOptions not provided', () => {
		render(<TransactionFilter {...defaultProps} />);
		expect(screen.queryByText('transaction_filter.operation_type')).not.toBeInTheDocument();
	});
});
