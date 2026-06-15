import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderWithRouter } from '@/test/test-utils';
import Signup from '../index';

const mockMutate = vi.fn();

vi.mock('@/entities/user/queries', () => ({
	useSignup: () => ({ mutate: mockMutate, isPending: false }),
}));

describe('Signup page', () => {
	it('renders first name field', () => {
		renderWithRouter(<Signup />);
		expect(screen.getByPlaceholderText('John')).toBeInTheDocument();
	});

	it('renders last name field', () => {
		renderWithRouter(<Signup />);
		expect(screen.getByPlaceholderText('Doe')).toBeInTheDocument();
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
		const firstName = screen.getByPlaceholderText('John');
		const lastName = screen.getByPlaceholderText('Doe');
		await userEvent.type(firstName, 'Ivan');
		await userEvent.type(lastName, 'Petrov');
		expect(firstName).toHaveValue('Ivan');
		expect(lastName).toHaveValue('Petrov');
	});
});
