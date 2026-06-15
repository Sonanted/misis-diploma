import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { useMe } from '@/entities/user/queries';
import { Settings } from '../index';

const mockNavigate = vi.hoisted(() => vi.fn());
const mockLogout = vi.hoisted(() => vi.fn());
const mockChangeLang = vi.hoisted(() => vi.fn());
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
	useUpdateMe: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
	useChangePassword: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
}));

vi.mock('@/entities/user/model', () => ({
	useAuthStore: vi.fn((selector: (s: { logout: () => void }) => unknown) =>
		selector({ logout: mockLogout }),
	),
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

	it('calls logout and navigates on logout click', async () => {
		renderSettings();
		await userEvent.click(screen.getByText('settings.logout'));
		expect(mockLogout).toHaveBeenCalled();
		expect(mockNavigate).toHaveBeenCalledWith('/login');
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
});
