import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';
import { describe, expect, it, vi } from 'vitest';
import * as authApi from '@/shared/api/auth';
import { renderWithRouter } from '@/test/test-utils';
import ForgotPassword from '../index';

vi.mock('sonner', () => ({ toast: { error: vi.fn(), info: vi.fn(), success: vi.fn() } }));

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

const mockNavigate = vi.hoisted(() => vi.fn());

vi.mock('react-router', async (importOriginal) => {
	const actual = await importOriginal<typeof import('react-router')>();
	return { ...actual, useNavigate: () => mockNavigate };
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

	it('shows demo code toast when requestPasswordReset returns a code', async () => {
		vi.mocked(authApi.requestPasswordReset).mockResolvedValueOnce({ code: '654321' });
		vi.mocked(toast.info).mockClear();

		renderWithRouter(<ForgotPassword />);
		await userEvent.click(screen.getByText('PhoneSubmit'));
		await waitFor(() => {
			expect(vi.mocked(toast.info)).toHaveBeenCalledWith('(demo: 654321)');
		});
	});

	it('stays on step 2 and shows error toast when verifyResetCode fails', async () => {
		vi.mocked(authApi.verifyResetCode).mockRejectedValueOnce(new Error('Invalid code'));
		vi.mocked(toast.error).mockClear();

		renderWithRouter(<ForgotPassword />);
		await userEvent.click(screen.getByText('PhoneSubmit'));
		await waitFor(() => screen.getByText('CodeSubmit'));
		await userEvent.click(screen.getByText('CodeSubmit'));

		await waitFor(() => {
			expect(vi.mocked(toast.error)).toHaveBeenCalledWith('auth.forgot_password.invalid_code');
		});
		expect(screen.getByText('CodeSubmit')).toBeInTheDocument();
	});

	it('navigates to /login after successful password reset', async () => {
		vi.mocked(authApi.resetPassword).mockResolvedValueOnce(undefined);
		vi.mocked(toast.success).mockClear();

		renderWithRouter(<ForgotPassword />);
		await userEvent.click(screen.getByText('PhoneSubmit'));
		await waitFor(() => screen.getByText('CodeSubmit'));
		await userEvent.click(screen.getByText('CodeSubmit'));
		await waitFor(() => screen.getByText('PasswordSubmit'));
		await userEvent.click(screen.getByText('PasswordSubmit'));

		await waitFor(() => {
			expect(vi.mocked(toast.success)).toHaveBeenCalledWith('auth.forgot_password.reset_success');
		});
	});

	it('shows error toast when resetPassword fails with generic error', async () => {
		vi.mocked(authApi.resetPassword).mockRejectedValueOnce(new Error('Server error'));
		vi.mocked(toast.error).mockClear();

		renderWithRouter(<ForgotPassword />);
		await userEvent.click(screen.getByText('PhoneSubmit'));
		await waitFor(() => screen.getByText('CodeSubmit'));
		await userEvent.click(screen.getByText('CodeSubmit'));
		await waitFor(() => screen.getByText('PasswordSubmit'));
		await userEvent.click(screen.getByText('PasswordSubmit'));

		await waitFor(() => {
			expect(vi.mocked(toast.error)).toHaveBeenCalledWith('auth.forgot_password.reset_error');
		});
	});

	it('shows axios response message when resetPassword fails with AxiosError', async () => {
		const axiosError = Object.assign(new Error(), {
			isAxiosError: true,
			response: { data: { message: 'Token expired' } },
		});
		vi.mocked(authApi.resetPassword).mockRejectedValueOnce(axiosError);
		vi.mocked(toast.error).mockClear();

		renderWithRouter(<ForgotPassword />);
		await userEvent.click(screen.getByText('PhoneSubmit'));
		await waitFor(() => screen.getByText('CodeSubmit'));
		await userEvent.click(screen.getByText('CodeSubmit'));
		await waitFor(() => screen.getByText('PasswordSubmit'));
		await userEvent.click(screen.getByText('PasswordSubmit'));

		await waitFor(() => {
			expect(vi.mocked(toast.error)).toHaveBeenCalledWith('Token expired');
		});
	});
});
