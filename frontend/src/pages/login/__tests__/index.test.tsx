import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';
import { describe, expect, it, vi } from 'vitest';
import { renderWithRouter } from '@/test/test-utils';
import Login from '../index';

vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

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

	it('calls mutate when phone and password are filled', async () => {
		mockMutate.mockClear();
		renderWithRouter(<Login />);

		// PhoneInput renders an <input type="tel"> internally via react-phone-number-input
		const phoneInput = document.querySelector('input[type="tel"]') as HTMLInputElement;
		const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;

		await userEvent.type(phoneInput, '9001234567');
		await userEvent.type(passwordInput, 'secret');
		await userEvent.click(screen.getByRole('button', { name: 'auth.login.submit' }));

		expect(mockMutate).toHaveBeenCalled();
	});

	it('shows response message on axios signin error', async () => {
		mockMutate.mockClear();
		vi.mocked(toast.error).mockClear();
		renderWithRouter(<Login />);

		const phoneInput = document.querySelector('input[type="tel"]') as HTMLInputElement;
		const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;
		await userEvent.type(phoneInput, '9001234567');
		await userEvent.type(passwordInput, 'secret');
		await userEvent.click(screen.getByRole('button', { name: 'auth.login.submit' }));

		const [, { onError }] = mockMutate.mock.calls[0];
		const axiosError = Object.assign(new Error(), {
			isAxiosError: true,
			response: { data: { message: 'Invalid credentials' } },
		});
		onError(axiosError);

		expect(vi.mocked(toast.error)).toHaveBeenCalledWith('Invalid credentials');
	});

	it('shows default error when axios response has no message', async () => {
		mockMutate.mockClear();
		vi.mocked(toast.error).mockClear();
		renderWithRouter(<Login />);

		const phoneInput = document.querySelector('input[type="tel"]') as HTMLInputElement;
		const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;
		await userEvent.type(phoneInput, '9001234567');
		await userEvent.type(passwordInput, 'secret');
		await userEvent.click(screen.getByRole('button', { name: 'auth.login.submit' }));

		const [, { onError }] = mockMutate.mock.calls[0];
		const axiosError = Object.assign(new Error(), { isAxiosError: true, response: { data: {} } });
		onError(axiosError);

		expect(vi.mocked(toast.error)).toHaveBeenCalledWith('auth.login.error');
	});

	it('shows default error for non-axios signin error', async () => {
		mockMutate.mockClear();
		vi.mocked(toast.error).mockClear();
		renderWithRouter(<Login />);

		const phoneInput = document.querySelector('input[type="tel"]') as HTMLInputElement;
		const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;
		await userEvent.type(phoneInput, '9001234567');
		await userEvent.type(passwordInput, 'secret');
		await userEvent.click(screen.getByRole('button', { name: 'auth.login.submit' }));

		const [, { onError }] = mockMutate.mock.calls[0];
		onError(new Error('Network error'));

		expect(vi.mocked(toast.error)).toHaveBeenCalledWith('auth.login.error');
	});
});
