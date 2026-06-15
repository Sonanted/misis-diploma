import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderWithRouter } from '@/test/test-utils';
import ForgotPassword from '../index';

vi.mock('@/features/auth/forgot-password/PhoneStep', () => ({
	PhoneStep: ({ onSubmit }: { onSubmit: (d: { phone: string }) => void }) => (
		<button type="button" onClick={() => onSubmit({ phone: '+79001234567' })}>
			PhoneSubmit
		</button>
	),
}));

vi.mock('@/features/auth/forgot-password/CodeStep', () => ({
	CodeStep: ({ onSubmit }: { onSubmit: (d: { code: string }) => void }) => (
		<button type="button" onClick={() => onSubmit({ code: '123456' })}>
			CodeSubmit
		</button>
	),
}));

vi.mock('@/features/auth/forgot-password/PasswordStep', () => ({
	PasswordStep: ({ onSubmit }: { onSubmit: (d: { newPassword: string }) => void }) => (
		<button type="button" onClick={() => onSubmit({ newPassword: 'NewPass123' })}>
			PasswordSubmit
		</button>
	),
}));

vi.mock('@/shared/api/auth', () => ({
	requestPasswordReset: vi.fn().mockResolvedValue({ code: null }),
	verifyResetCode: vi.fn().mockResolvedValue({}),
	resetPassword: vi.fn().mockResolvedValue({}),
}));

vi.mock('react-router', async (importOriginal) => {
	const actual = await importOriginal<typeof import('react-router')>();
	return { ...actual, useNavigate: () => vi.fn() };
});

describe('ForgotPassword page', () => {
	it('renders title', () => {
		renderWithRouter(<ForgotPassword />);
		expect(screen.getByText('auth.forgot_password.title')).toBeInTheDocument();
	});

	it('shows step 1 description initially', () => {
		renderWithRouter(<ForgotPassword />);
		expect(screen.getByText('auth.forgot_password.step1_description')).toBeInTheDocument();
	});

	it('renders PhoneStep in step 1', () => {
		renderWithRouter(<ForgotPassword />);
		expect(screen.getByText('PhoneSubmit')).toBeInTheDocument();
	});

	it('transitions to step 2 after PhoneStep submit', async () => {
		renderWithRouter(<ForgotPassword />);
		await userEvent.click(screen.getByText('PhoneSubmit'));
		await waitFor(() => {
			expect(screen.getByText('CodeSubmit')).toBeInTheDocument();
		});
	});

	it('shows step 2 description after phone submit', async () => {
		renderWithRouter(<ForgotPassword />);
		await userEvent.click(screen.getByText('PhoneSubmit'));
		await waitFor(() => {
			expect(screen.getByText('auth.forgot_password.step2_description')).toBeInTheDocument();
		});
	});

	it('transitions to step 3 after CodeStep submit', async () => {
		renderWithRouter(<ForgotPassword />);
		await userEvent.click(screen.getByText('PhoneSubmit'));
		await waitFor(() => screen.getByText('CodeSubmit'));
		await userEvent.click(screen.getByText('CodeSubmit'));
		await waitFor(() => {
			expect(screen.getByText('PasswordSubmit')).toBeInTheDocument();
		});
	});

	it('shows step 3 description on last step', async () => {
		renderWithRouter(<ForgotPassword />);
		await userEvent.click(screen.getByText('PhoneSubmit'));
		await waitFor(() => screen.getByText('CodeSubmit'));
		await userEvent.click(screen.getByText('CodeSubmit'));
		await waitFor(() => {
			expect(screen.getByText('auth.forgot_password.step3_description')).toBeInTheDocument();
		});
	});
});
