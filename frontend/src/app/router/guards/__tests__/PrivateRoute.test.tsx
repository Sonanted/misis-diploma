import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { beforeEach, describe, expect, it } from 'vitest';
import { useAuthStore } from '@/entities/user/model';
import PrivateRoute from '../PrivateRoute';

function makeValidToken(): string {
	const payload = { exp: Math.floor((Date.now() + 60 * 60 * 1000) / 1000) };
	return `h.${btoa(JSON.stringify(payload))}.s`;
}

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
		useAuthStore.setState({ isAuthenticated: false, token: null });
	});

	it('redirects to /login when not authenticated', () => {
		renderGuard('/');
		expect(screen.getByText('Login Page')).toBeInTheDocument();
		expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
	});

	it('renders protected content when authenticated with valid token', () => {
		useAuthStore.setState({ isAuthenticated: true, token: makeValidToken() });
		renderGuard('/');
		expect(screen.getByText('Protected Content')).toBeInTheDocument();
		expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
	});

	it('redirects to /login when token is expired', () => {
		const expiredPayload = { exp: Math.floor((Date.now() - 5000) / 1000) };
		const expiredToken = `h.${btoa(JSON.stringify(expiredPayload))}.s`;
		useAuthStore.setState({ isAuthenticated: true, token: expiredToken });
		renderGuard('/');
		expect(screen.getByText('Login Page')).toBeInTheDocument();
	});
});
