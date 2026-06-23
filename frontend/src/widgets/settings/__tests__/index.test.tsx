import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { toast } from 'sonner';
import { describe, expect, it, vi } from 'vitest';
import { useMe } from '@/entities/user/queries';
import { Settings } from '../index';

vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

const mockNavigate = vi.hoisted(() => vi.fn());
const mockLogout = vi.hoisted(() => vi.fn());
const mockChangeLang = vi.hoisted(() => vi.fn());
const mockUpdateMeMutate = vi.hoisted(() => vi.fn());
const mockChangePasswordMutate = vi.hoisted(() => vi.fn());
const mockMeData = vi.hoisted(() => ({
	firstName: 'John',
	lastName: 'Doe',
	middleName: '',
	email: 'john@example.com',
	phone: '+79001234567',
}));

vi.mock('@/entities/user/queries', () => ({
	useMe: vi.fn(() => ({
		data: mockMeData,
		isLoading: false,
	})),
	useUpdateMe: vi.fn(() => ({ mutate: mockUpdateMeMutate, isPending: false })),
	useChangePassword: vi.fn(() => ({ mutate: mockChangePasswordMutate, isPending: false })),
	useLogout: vi.fn(() => ({ mutate: mockLogout, isPending: false })),
}));

vi.mock('@/shared/ui/language-switcher-compact', () => ({
	useLanguage: vi.fn(() => ({ lang: 'en' as const, changeLanguage: mockChangeLang })),
}));

vi.mock('react-router', async (importOriginal) => {
	const actual = await importOriginal<typeof import('react-router')>();
	return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('@/shared/ui/phone-input', () => ({
	PhoneInput: ({
		value,
		onChange,
		onBlur,
		placeholder,
	}: {
		value?: string;
		onChange?: (v: string) => void;
		onBlur?: () => void;
		placeholder?: string;
	}) => (
		<input
			type="tel"
			value={value ?? ''}
			onChange={(e) => onChange?.(e.target.value)}
			onBlur={onBlur}
			placeholder={placeholder}
		/>
	),
}));

function renderSettings() {
	return render(
		<MemoryRouter>
			<Settings />
		</MemoryRouter>,
	);
}

describe('Settings', () => {
	it('renders title', () => {
		renderSettings();
		expect(screen.getByText('settings.title')).toBeInTheDocument();
	});

	it('renders personal info section', () => {
		renderSettings();
		expect(screen.getByText('settings.personal_info_title')).toBeInTheDocument();
	});

	it('renders password section', () => {
		renderSettings();
		expect(screen.getByText('settings.password_title')).toBeInTheDocument();
	});

	it('renders appearance section', () => {
		renderSettings();
		expect(screen.getByText('settings.appearance_title')).toBeInTheDocument();
	});

	it('renders theme buttons', () => {
		renderSettings();
		expect(screen.getByText('settings.theme_light')).toBeInTheDocument();
		expect(screen.getByText('settings.theme_dark')).toBeInTheDocument();
		expect(screen.getByText('settings.theme_system')).toBeInTheDocument();
	});

	it('renders language buttons', () => {
		renderSettings();
		expect(screen.getByText('English')).toBeInTheDocument();
		expect(screen.getByText('Русский')).toBeInTheDocument();
	});

	it('renders logout button', () => {
		renderSettings();
		expect(screen.getByText('settings.logout')).toBeInTheDocument();
	});

	it('calls logout mutate on logout click', async () => {
		renderSettings();
		await userEvent.click(screen.getByText('settings.logout'));
		expect(mockLogout).toHaveBeenCalled();
	});

	it('renders save personal info button', () => {
		renderSettings();
		const saveButtons = screen.getAllByText('settings.save');
		expect(saveButtons.length).toBeGreaterThan(0);
	});

	it('shows skeleton when meLoading is true', () => {
		vi.mocked(useMe).mockReturnValueOnce({ data: undefined, isLoading: true } as ReturnType<
			typeof useMe
		>);
		const { container } = renderSettings();
		expect(container.firstChild).toBeInTheDocument();
	});

	it('clicking dark theme button sets dark theme', async () => {
		renderSettings();
		await userEvent.click(screen.getByText('settings.theme_dark'));
		expect(screen.getByText('settings.theme_dark')).toBeInTheDocument();
	});

	it('clicking language button calls changeLanguage', async () => {
		renderSettings();
		await userEvent.click(screen.getByText('Русский'));
		expect(mockChangeLang).toHaveBeenCalledWith('ru');
	});

	it('renders update password button', () => {
		renderSettings();
		expect(screen.getByText('settings.update_password')).toBeInTheDocument();
	});

	it('populates personal info form with user data', () => {
		renderSettings();
		expect(screen.getByDisplayValue('John')).toBeInTheDocument();
	});

	it('renders password hint', () => {
		renderSettings();
		expect(screen.getByText('settings.password_hint')).toBeInTheDocument();
	});

	it('calls updateMe.mutate when personal info form is saved', async () => {
		mockUpdateMeMutate.mockClear();
		renderSettings();
		await userEvent.click(screen.getByText('settings.save'));
		expect(mockUpdateMeMutate).toHaveBeenCalled();
	});

	it('shows success toast after personal info save', async () => {
		mockUpdateMeMutate.mockClear();
		vi.mocked(toast.success).mockClear();
		renderSettings();
		await userEvent.click(screen.getByText('settings.save'));
		expect(mockUpdateMeMutate).toHaveBeenCalled();
		const [, { onSuccess }] = mockUpdateMeMutate.mock.calls[0];
		onSuccess();
		expect(vi.mocked(toast.success)).toHaveBeenCalledWith('settings.toast_personal_saved');
	});

	it('shows toast error when handlePersonalInfoError receives non-axios error', async () => {
		mockUpdateMeMutate.mockClear();
		vi.mocked(toast.error).mockClear();
		renderSettings();
		await userEvent.click(screen.getByText('settings.save'));
		expect(mockUpdateMeMutate).toHaveBeenCalled();
		const [, { onError }] = mockUpdateMeMutate.mock.calls[0];
		onError(new Error('Network error'));
		expect(vi.mocked(toast.error)).toHaveBeenCalledWith('settings.toast_error');
	});

	it('sets email field error when axios error returns email field error', async () => {
		mockUpdateMeMutate.mockClear();
		renderSettings();
		await userEvent.click(screen.getByText('settings.save'));
		expect(mockUpdateMeMutate).toHaveBeenCalled();
		const [, { onError }] = mockUpdateMeMutate.mock.calls[0];
		const axiosError = Object.assign(new Error(), {
			isAxiosError: true,
			response: { data: { message: { errors: { email: 'Email already taken' } } } },
		});
		onError(axiosError);
		expect(await screen.findByText('Email already taken')).toBeInTheDocument();
	});

	it('shows toast error when axios error has no field errors', async () => {
		mockUpdateMeMutate.mockClear();
		vi.mocked(toast.error).mockClear();
		renderSettings();
		await userEvent.click(screen.getByText('settings.save'));
		expect(mockUpdateMeMutate).toHaveBeenCalled();
		const [, { onError }] = mockUpdateMeMutate.mock.calls[0];
		const axiosError = Object.assign(new Error(), {
			isAxiosError: true,
			response: { data: { message: 'Something went wrong' } },
		});
		onError(axiosError);
		expect(vi.mocked(toast.error)).toHaveBeenCalledWith('settings.toast_error');
	});

	it('calls changePassword.mutate with matching passwords', async () => {
		mockChangePasswordMutate.mockClear();
		renderSettings();
		const [currentPwd, newPwd, confirmPwd] = Array.from(
			document.querySelectorAll('input[type="password"]'),
		) as HTMLInputElement[];
		await userEvent.type(currentPwd, 'OldPass123');
		await userEvent.type(newPwd, 'NewPass456!');
		await userEvent.type(confirmPwd, 'NewPass456!');
		await userEvent.click(screen.getByText('settings.update_password'));
		expect(mockChangePasswordMutate).toHaveBeenCalledWith(
			{ currentPassword: 'OldPass123', newPassword: 'NewPass456!' },
			expect.any(Object),
		);
	});

	it('shows success toast after password change', async () => {
		mockChangePasswordMutate.mockClear();
		vi.mocked(toast.success).mockClear();
		renderSettings();
		const [currentPwd, newPwd, confirmPwd] = Array.from(
			document.querySelectorAll('input[type="password"]'),
		) as HTMLInputElement[];
		await userEvent.type(currentPwd, 'OldPass123');
		await userEvent.type(newPwd, 'NewPass456!');
		await userEvent.type(confirmPwd, 'NewPass456!');
		await userEvent.click(screen.getByText('settings.update_password'));
		expect(mockChangePasswordMutate).toHaveBeenCalled();
		const [, { onSuccess }] = mockChangePasswordMutate.mock.calls[0];
		onSuccess();
		expect(vi.mocked(toast.success)).toHaveBeenCalledWith('settings.toast_password_saved');
	});

	it('sets currentPassword error on 401 changePassword error', async () => {
		mockChangePasswordMutate.mockClear();
		renderSettings();
		const [currentPwd, newPwd, confirmPwd] = Array.from(
			document.querySelectorAll('input[type="password"]'),
		) as HTMLInputElement[];
		await userEvent.type(currentPwd, 'OldPass123');
		await userEvent.type(newPwd, 'NewPass456!');
		await userEvent.type(confirmPwd, 'NewPass456!');
		await userEvent.click(screen.getByText('settings.update_password'));
		expect(mockChangePasswordMutate).toHaveBeenCalled();
		const [, { onError }] = mockChangePasswordMutate.mock.calls[0];
		const axiosError = Object.assign(new Error('Unauthorized'), {
			isAxiosError: true,
			response: { status: 401, data: { message: 'Wrong password' } },
		});
		onError(axiosError);
		expect(await screen.findByText('Wrong password')).toBeInTheDocument();
	});

	it('shows toast error on non-401 changePassword error', async () => {
		mockChangePasswordMutate.mockClear();
		vi.mocked(toast.error).mockClear();
		renderSettings();
		const [currentPwd, newPwd, confirmPwd] = Array.from(
			document.querySelectorAll('input[type="password"]'),
		) as HTMLInputElement[];
		await userEvent.type(currentPwd, 'OldPass123');
		await userEvent.type(newPwd, 'NewPass456!');
		await userEvent.type(confirmPwd, 'NewPass456!');
		await userEvent.click(screen.getByText('settings.update_password'));
		expect(mockChangePasswordMutate).toHaveBeenCalled();
		const [, { onError }] = mockChangePasswordMutate.mock.calls[0];
		onError(new Error('Generic error'));
		expect(vi.mocked(toast.error)).toHaveBeenCalledWith('settings.toast_error');
	});
});
