import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { BalanceToggle } from '../balance-toggle';

describe('BalanceToggle', () => {
	it('renders a button', () => {
		render(<BalanceToggle visible={true} onToggle={vi.fn()} />);
		expect(screen.getByRole('button')).toBeInTheDocument();
	});

	it('shows aria-label for hide when visible=true', () => {
		render(<BalanceToggle visible={true} onToggle={vi.fn()} />);
		// i18n returns the key since no translations
		expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'balance_toggle.hide');
	});

	it('shows aria-label for show when visible=false', () => {
		render(<BalanceToggle visible={false} onToggle={vi.fn()} />);
		expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'balance_toggle.show');
	});

	it('calls onToggle when clicked', async () => {
		const onToggle = vi.fn();
		render(<BalanceToggle visible={true} onToggle={onToggle} />);
		await userEvent.click(screen.getByRole('button'));
		expect(onToggle).toHaveBeenCalledOnce();
	});

	it('renders an SVG icon', () => {
		const { container } = render(<BalanceToggle visible={true} onToggle={vi.fn()} />);
		expect(container.querySelector('svg')).toBeInTheDocument();
	});
});
