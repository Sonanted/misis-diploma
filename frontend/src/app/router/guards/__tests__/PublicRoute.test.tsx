import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/entities/user/use-auth', () => ({
	useAuth: vi.fn(),
}));

import { useAuth } from '@/entities/user/use-auth';
import PublicRoute from '../PublicRoute';

function renderGuard() {
	return render(
		<MemoryRouter initialEntries={['/login']}>
			<Routes>
				<Route element={<PublicRoute />}>
					<Route path="/login" element={<div>Login Page</div>} />
				</Route>
				<Route path="/" element={<div>Dashboard</div>} />
			</Routes>
		</MemoryRouter>,
	);
}

describe('PublicRoute', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders children when not authenticated', () => {
		vi.mocked(useAuth).mockReturnValue({ isAuthenticated: false, isLoading: false });
		renderGuard();
		expect(screen.getByText('Login Page')).toBeInTheDocument();
		expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
	});

	it('redirects to / when authenticated', () => {
		vi.mocked(useAuth).mockReturnValue({ isAuthenticated: true, isLoading: false });
		renderGuard();
		expect(screen.getByText('Dashboard')).toBeInTheDocument();
		expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
	});

	it('renders nothing while loading', () => {
		vi.mocked(useAuth).mockReturnValue({ isAuthenticated: false, isLoading: true });
		const { container } = renderGuard();
		expect(container).toBeEmptyDOMElement();
	});
});
