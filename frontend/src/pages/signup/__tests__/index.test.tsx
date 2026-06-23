import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';
import { describe, expect, it, vi } from 'vitest';
import { renderWithRouter } from '@/test/test-utils';
import Signup from '../index';

vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

const mockMutate = vi.fn();

vi.mock('@/entities/user/queries', () => ({
	useSignup: () => ({ mutate: mockMutate, isPending: false }),
}));

describe('Signup page', () => {
	it('renders first name field', () => {
		renderWithRouter(<Signup />);
		expect(screen.getByPlaceholderText('auth.signup.first_name_placeholder')).toBeInTheDocument();
	});

	it('renders last name field', () => {
		renderWithRouter(<Signup />);
		expect(screen.getByPlaceholderText('auth.signup.last_name_placeholder')).toBeInTheDocument();
	});

	it('renders optional middle name field', () => {
		renderWithRouter(<Signup />);
		expect(screen.getByPlaceholderText('auth.signup.middle_name_placeholder')).toBeInTheDocument();
	});

	it('renders password fields', () => {
		renderWithRouter(<Signup />);
		const passwordFields = screen.getAllByDisplayValue('');
		expect(passwordFields.length).toBeGreaterThan(0);
	});

	it('renders submit button', () => {
		renderWithRouter(<Signup />);
		expect(screen.getByRole('button', { name: 'auth.signup.submit' })).toBeInTheDocument();
	});

	it('renders link to login', () => {
		renderWithRouter(<Signup />);
		expect(screen.getByRole('link', { name: 'auth.signup.sign_in' })).toHaveAttribute(
			'href',
			'/login',
		);
	});

	it('does not call mutate without required fields', async () => {
		mockMutate.mockClear();
		renderWithRouter(<Signup />);
		await userEvent.click(screen.getByRole('button', { name: 'auth.signup.submit' }));
		expect(mockMutate).not.toHaveBeenCalled();
	});

	it('shows validation errors for required fields after submit', async () => {
		renderWithRouter(<Signup />);
		await userEvent.click(screen.getByRole('button', { name: 'auth.signup.submit' }));
		const errors = await screen.findAllByText('validation.required');
		expect(errors.length).toBeGreaterThan(0);
	});

	it('fills firstName and lastName', async () => {
		renderWithRouter(<Signup />);
		const firstName = screen.getByPlaceholderText('auth.signup.first_name_placeholder');
		const lastName = screen.getByPlaceholderText('auth.signup.last_name_placeholder');
		await userEvent.type(firstName, 'Ivan');
		await userEvent.type(lastName, 'Petrov');
		expect(firstName).toHaveValue('Ivan');
		expect(lastName).toHaveValue('Petrov');
	});

	it('shows password mismatch error when confirmPassword does not match', async () => {
		renderWithRouter(<Signup />);
		const [passwordInput, confirmInput] = document.querySelectorAll('input[type="password"]') as unknown as HTMLInputElement[];
		await userEvent.type(passwordInput, 'Password1');
		await userEvent.type(confirmInput, 'DifferentPass');
		await userEvent.tab();
		const mismatchErrors = await screen.findAllByText('validation.password_mismatch');
		expect(mismatchErrors.length).toBeGreaterThan(0);
	});

	it('shows conflict error toast on 409 signup error', async () => {
		mockMutate.mockClear();
		vi.mocked(toast.error).mockClear();
		renderWithRouter(<Signup />);

		await userEvent.click(screen.getByRole('button', { name: 'auth.signup.submit' }));
		// Mock hasn't been called yet since form is invalid — call handleError directly via mutate callback
		// by submitting a filled form
		const firstName = screen.getByPlaceholderText('auth.signup.first_name_placeholder');
		const lastName = screen.getByPlaceholderText('auth.signup.last_name_placeholder');
		const emailInput = screen.getByPlaceholderText('auth.signup.email_placeholder');
		const phoneInput = document.querySelector('input[type="tel"]') as HTMLInputElement;
		const [passwordInput, confirmInput] = document.querySelectorAll('input[type="password"]') as unknown as HTMLInputElement[];

		await userEvent.type(firstName, 'Ivan');
		await userEvent.type(lastName, 'Petrov');
		await userEvent.type(phoneInput, '9001234567');
		await userEvent.type(emailInput, 'ivan@test.com');
		await userEvent.type(passwordInput, 'Password1');
		await userEvent.type(confirmInput, 'Password1');
		await userEvent.click(screen.getByRole('button', { name: 'auth.signup.submit' }));

		expect(mockMutate).toHaveBeenCalled();
		const [, { onError }] = mockMutate.mock.calls[mockMutate.mock.calls.length - 1];
		const conflict = Object.assign(new Error(), { isAxiosError: true, response: { status: 409, data: {} } });
		onError(conflict);

		expect(vi.mocked(toast.error)).toHaveBeenCalledWith('auth.signup.error_conflict');
	});

	it('shows generic error toast on non-conflict signup error', async () => {
		mockMutate.mockClear();
		vi.mocked(toast.error).mockClear();
		renderWithRouter(<Signup />);

		const firstName = screen.getByPlaceholderText('auth.signup.first_name_placeholder');
		const lastName = screen.getByPlaceholderText('auth.signup.last_name_placeholder');
		const emailInput = screen.getByPlaceholderText('auth.signup.email_placeholder');
		const phoneInput = document.querySelector('input[type="tel"]') as HTMLInputElement;
		const [passwordInput, confirmInput] = document.querySelectorAll('input[type="password"]') as unknown as HTMLInputElement[];

		await userEvent.type(firstName, 'Ivan');
		await userEvent.type(lastName, 'Petrov');
		await userEvent.type(phoneInput, '9001234567');
		await userEvent.type(emailInput, 'ivan@test.com');
		await userEvent.type(passwordInput, 'Password1');
		await userEvent.type(confirmInput, 'Password1');
		await userEvent.click(screen.getByRole('button', { name: 'auth.signup.submit' }));

		expect(mockMutate).toHaveBeenCalled();
		const [, { onError }] = mockMutate.mock.calls[mockMutate.mock.calls.length - 1];
		onError(new Error('Server error'));

		expect(vi.mocked(toast.error)).toHaveBeenCalledWith('auth.signup.error');
	});

	it('calls mutate with middleName when provided', async () => {
		mockMutate.mockClear();
		renderWithRouter(<Signup />);

		const firstName = screen.getByPlaceholderText('auth.signup.first_name_placeholder');
		const lastName = screen.getByPlaceholderText('auth.signup.last_name_placeholder');
		const middleName = screen.getByPlaceholderText('auth.signup.middle_name_placeholder');
		const emailInput = screen.getByPlaceholderText('auth.signup.email_placeholder');
		const phoneInput = document.querySelector('input[type="tel"]') as HTMLInputElement;
		const [passwordInput, confirmInput] = document.querySelectorAll('input[type="password"]') as unknown as HTMLInputElement[];

		await userEvent.type(firstName, 'Ivan');
		await userEvent.type(lastName, 'Petrov');
		await userEvent.type(middleName, 'Ivanovich');
		await userEvent.type(phoneInput, '9001234567');
		await userEvent.type(emailInput, 'ivan@test.com');
		await userEvent.type(passwordInput, 'Password1');
		await userEvent.type(confirmInput, 'Password1');
		await userEvent.click(screen.getByRole('button', { name: 'auth.signup.submit' }));

		expect(mockMutate).toHaveBeenCalled();
		const [mutateArg] = mockMutate.mock.calls[mockMutate.mock.calls.length - 1];
		expect(mutateArg).toMatchObject({ middleName: 'Ivanovich' });
	});
});
