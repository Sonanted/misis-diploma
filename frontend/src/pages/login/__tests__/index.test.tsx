import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderWithRouter } from '@/test/test-utils';
import Login from '../index';

const mockMutate = vi.fn();

vi.mock('@/entities/user/queries', () => ({
	useSignin: () => ({ mutate: mockMutate, isPending: false }),
}));

describe('Login page', () => {
	it('renders password label text', () => {
		renderWithRouter(<Login />);
		expect(screen.getByText('auth.login.password')).toBeInTheDocument();
	});

	it('renders phone label text', () => {
		renderWithRouter(<Login />);
		expect(screen.getByText('auth.login.phone')).toBeInTheDocument();
	});

	it('renders submit button', () => {
		renderWithRouter(<Login />);
		expect(screen.getByRole('button', { name: 'auth.login.submit' })).toBeInTheDocument();
	});

	it('renders link to forgot-password', () => {
		renderWithRouter(<Login />);
		expect(screen.getByRole('link', { name: 'auth.login.forgot_password' })).toHaveAttribute(
			'href',
			'/forgot-password',
		);
	});

	it('renders link to signup', () => {
		renderWithRouter(<Login />);
		expect(screen.getByRole('link', { name: 'auth.login.sign_up' })).toHaveAttribute(
			'href',
			'/signup',
		);
	});

	it('renders password input field', () => {
		renderWithRouter(<Login />);
		const passwordInput = document.querySelector('input[type="password"]');
		expect(passwordInput).toBeInTheDocument();
	});

	it('does not call mutate when form is empty on submit', async () => {
		mockMutate.mockClear();
		renderWithRouter(<Login />);
		await userEvent.click(screen.getByRole('button', { name: 'auth.login.submit' }));
		expect(mockMutate).not.toHaveBeenCalled();
	});
});
