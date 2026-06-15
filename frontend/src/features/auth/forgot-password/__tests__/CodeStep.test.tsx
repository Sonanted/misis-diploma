import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithRouter } from '@/test/test-utils';
import { CodeStep } from '../CodeStep';

describe('CodeStep', () => {
	it('renders verify code button', () => {
		renderWithRouter(<CodeStep onSubmit={vi.fn()} />);
		expect(screen.getByRole('button', { name: 'auth.forgot_password.verify_code' })).toBeInTheDocument();
	});

	it('renders code label', () => {
		renderWithRouter(<CodeStep onSubmit={vi.fn()} />);
		expect(screen.getByText('auth.forgot_password.code')).toBeInTheDocument();
	});

	it('renders link back to login', () => {
		renderWithRouter(<CodeStep onSubmit={vi.fn()} />);
		expect(screen.getByRole('link', { name: 'auth.forgot_password.sign_in' })).toHaveAttribute(
			'href',
			'/login',
		);
	});

	it('shows loading text when loading=true', () => {
		renderWithRouter(<CodeStep onSubmit={vi.fn()} loading={true} />);
		expect(screen.getByRole('button', { name: 'common.loading' })).toBeInTheDocument();
	});

	it('disables button when loading', () => {
		renderWithRouter(<CodeStep onSubmit={vi.fn()} loading={true} />);
		expect(screen.getByRole('button', { name: 'common.loading' })).toBeDisabled();
	});

	it('renders OTP input slots', () => {
		const { container } = renderWithRouter(<CodeStep onSubmit={vi.fn()} />);
		// InputOTP renders individual slot inputs
		const inputs = container.querySelectorAll('input');
		expect(inputs.length).toBeGreaterThan(0);
	});
});
