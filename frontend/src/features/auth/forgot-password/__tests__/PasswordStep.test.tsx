import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderWithRouter } from '@/test/test-utils';
import { PasswordStep } from '../PasswordStep';

describe('PasswordStep', () => {
	it('renders reset password button', () => {
		renderWithRouter(<PasswordStep onSubmit={vi.fn()} />);
		expect(screen.getByRole('button', { name: 'auth.forgot_password.reset_password' })).toBeInTheDocument();
	});

	it('renders new password label', () => {
		renderWithRouter(<PasswordStep onSubmit={vi.fn()} />);
		expect(screen.getByText('auth.forgot_password.new_password')).toBeInTheDocument();
	});

	it('renders confirm password label', () => {
		renderWithRouter(<PasswordStep onSubmit={vi.fn()} />);
		expect(screen.getByText('auth.forgot_password.confirm_password')).toBeInTheDocument();
	});

	it('renders link back to login', () => {
		renderWithRouter(<PasswordStep onSubmit={vi.fn()} />);
		expect(screen.getByRole('link', { name: 'auth.forgot_password.sign_in' })).toHaveAttribute(
			'href',
			'/login',
		);
	});

	it('shows loading text when loading=true', () => {
		renderWithRouter(<PasswordStep onSubmit={vi.fn()} loading={true} />);
		expect(screen.getByRole('button', { name: 'common.loading' })).toBeInTheDocument();
	});

	it('disables button when loading', () => {
		renderWithRouter(<PasswordStep onSubmit={vi.fn()} loading={true} />);
		expect(screen.getByRole('button', { name: 'common.loading' })).toBeDisabled();
	});

	it('renders two password inputs', () => {
		const { container } = renderWithRouter(<PasswordStep onSubmit={vi.fn()} />);
		const passwordInputs = container.querySelectorAll('input[type="password"]');
		expect(passwordInputs).toHaveLength(2);
	});

	it('does not call onSubmit when passwords are empty', async () => {
		const onSubmit = vi.fn();
		renderWithRouter(<PasswordStep onSubmit={onSubmit} />);
		await userEvent.click(screen.getByRole('button', { name: 'auth.forgot_password.reset_password' }));
		expect(onSubmit).not.toHaveBeenCalled();
	});

	it('shows validation error when passwords do not match', async () => {
		renderWithRouter(<PasswordStep onSubmit={vi.fn()} />);
		const [newPw, confirmPw] = document.querySelectorAll('input[type="password"]');
		await userEvent.type(newPw, 'password123');
		await userEvent.type(confirmPw, 'different456');
		await userEvent.click(screen.getByRole('button', { name: 'auth.forgot_password.reset_password' }));
		const error = await screen.findByText('validation.password_mismatch');
		expect(error).toBeInTheDocument();
	});
});
