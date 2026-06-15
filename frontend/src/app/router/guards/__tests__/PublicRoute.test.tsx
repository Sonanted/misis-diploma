import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { beforeEach, describe, expect, it } from 'vitest';
import { useAuthStore } from '@/entities/user/model';
import PublicRoute from '../PublicRoute';

function makeValidToken(): string {
	const payload = { exp: Math.floor((Date.now() + 60 * 60 * 1000) / 1000) };
	return `h.${btoa(JSON.stringify(payload))}.s`;
}

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
		useAuthStore.setState({ isAuthenticated: false, token: null });
	});

	it('renders children when not authenticated', () => {
		renderGuard();
		expect(screen.getByText('Login Page')).toBeInTheDocument();
		expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
	});

	it('redirects to / when authenticated with valid token', () => {
		useAuthStore.setState({ isAuthenticated: true, token: makeValidToken() });
		renderGuard();
		expect(screen.getByText('Dashboard')).toBeInTheDocument();
		expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
	});

	it('renders children when token is expired (treated as unauthenticated)', () => {
		const expiredPayload = { exp: Math.floor((Date.now() - 5000) / 1000) };
		const expiredToken = `h.${btoa(JSON.stringify(expiredPayload))}.s`;
		useAuthStore.setState({ isAuthenticated: true, token: expiredToken });
		renderGuard();
		expect(screen.getByText('Login Page')).toBeInTheDocument();
	});
});
