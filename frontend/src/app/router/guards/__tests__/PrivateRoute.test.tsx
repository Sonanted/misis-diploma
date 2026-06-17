import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/entities/user/use-auth', () => ({
	useAuth: vi.fn(),
}));

import { useAuth } from '@/entities/user/use-auth';
import PrivateRoute from '../PrivateRoute';

function renderGuard(initialPath = '/') {
	return render(
		<MemoryRouter initialEntries={[initialPath]}>
			<Routes>
				<Route element={<PrivateRoute />}>
					<Route path="/" element={<div>Protected Content</div>} />
				</Route>
				<Route path="/login" element={<div>Login Page</div>} />
			</Routes>
		</MemoryRouter>,
	);
}

describe('PrivateRoute', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('redirects to /login when not authenticated', () => {
		vi.mocked(useAuth).mockReturnValue({ isAuthenticated: false, isLoading: false });
		renderGuard('/');
		expect(screen.getByText('Login Page')).toBeInTheDocument();
		expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
	});

	it('renders protected content when authenticated', () => {
		vi.mocked(useAuth).mockReturnValue({ isAuthenticated: true, isLoading: false });
		renderGuard('/');
		expect(screen.getByText('Protected Content')).toBeInTheDocument();
		expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
	});

	it('renders nothing while loading', () => {
		vi.mocked(useAuth).mockReturnValue({ isAuthenticated: false, isLoading: true });
		const { container } = renderGuard('/');
		expect(container).toBeEmptyDOMElement();
	});
});
