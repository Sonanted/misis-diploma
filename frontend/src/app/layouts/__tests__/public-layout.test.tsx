import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import PublicLayout from '../public-layout';

vi.mock('@/shared/ui/theme-switcher-compact', () => ({
	ThemeSwitcherCompact: () => <div data-testid="theme-switcher" />,
	useTheme: () => ({ theme: 'light', setTheme: vi.fn() }),
}));

vi.mock('@/shared/ui/language-switcher-compact', () => ({
	LanguageSwitcherCompact: () => <div data-testid="lang-switcher" />,
	useLanguage: () => ({ lang: 'en', changeLanguage: vi.fn() }),
}));

describe('PublicLayout', () => {
	function renderLayout(children?: React.ReactNode) {
		return render(
			<MemoryRouter initialEntries={['/login']}>
				<Routes>
					<Route element={<PublicLayout />}>
						<Route path="/login" element={<div>Login Content</div>} />
					</Route>
				</Routes>
			</MemoryRouter>,
		);
	}

	it('renders theme switcher', () => {
		renderLayout();
		expect(screen.getByTestId('theme-switcher')).toBeInTheDocument();
	});

	it('renders language switcher', () => {
		renderLayout();
		expect(screen.getByTestId('lang-switcher')).toBeInTheDocument();
	});

	it('renders outlet content', () => {
		renderLayout();
		expect(screen.getByText('Login Content')).toBeInTheDocument();
	});
});
