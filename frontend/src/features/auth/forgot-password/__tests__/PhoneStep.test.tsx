import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderWithRouter } from '@/test/test-utils';
import { PhoneStep } from '../PhoneStep';

describe('PhoneStep', () => {
	it('renders send code button', () => {
		renderWithRouter(<PhoneStep onSubmit={vi.fn()} />);
		expect(screen.getByRole('button', { name: 'auth.forgot_password.send_code' })).toBeInTheDocument();
	});

	it('renders phone label', () => {
		renderWithRouter(<PhoneStep onSubmit={vi.fn()} />);
		expect(screen.getByText('auth.forgot_password.phone')).toBeInTheDocument();
	});

	it('renders link back to login', () => {
		renderWithRouter(<PhoneStep onSubmit={vi.fn()} />);
		expect(screen.getByRole('link', { name: 'auth.forgot_password.sign_in' })).toHaveAttribute(
			'href',
			'/login',
		);
	});

	it('shows loading text when loading=true', () => {
		renderWithRouter(<PhoneStep onSubmit={vi.fn()} loading={true} />);
		expect(screen.getByRole('button', { name: 'common.loading' })).toBeInTheDocument();
	});

	it('disables button when loading', () => {
		renderWithRouter(<PhoneStep onSubmit={vi.fn()} loading={true} />);
		expect(screen.getByRole('button', { name: 'common.loading' })).toBeDisabled();
	});

	it('does not call onSubmit when phone is empty', async () => {
		const onSubmit = vi.fn();
		renderWithRouter(<PhoneStep onSubmit={onSubmit} />);
		await userEvent.click(screen.getByRole('button', { name: 'auth.forgot_password.send_code' }));
		expect(onSubmit).not.toHaveBeenCalled();
	});
});
