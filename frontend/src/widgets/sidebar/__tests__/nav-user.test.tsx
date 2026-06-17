import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import type { ApiUser } from '@/shared/api/types';
import { NavUser } from '../nav-user';

vi.mock('@/entities/user/queries', () => ({
	useLogout: vi.fn(() => ({ mutate: vi.fn(), isPending: false })),
}));

vi.mock('@/shared/ui/sidebar', () => ({
	SidebarMenu: ({ children }: { children: ReactNode }) => <ul>{children}</ul>,
	SidebarMenuItem: ({ children }: { children: ReactNode }) => <li>{children}</li>,
	SidebarMenuButton: ({ children }: { children: ReactNode }) => <button type="button">{children}</button>,
}));

const baseUser: ApiUser = {
	id: 'usr1',
	firstName: 'Ivan',
	lastName: 'Petrov',
	middleName: undefined,
	email: 'ivan@example.com',
	phone: '+79001234567',
	primaryAccountId: null,
	createdAt: '2024-01-01T00:00:00Z',
	updatedAt: '2024-01-01T00:00:00Z',
};

function renderNavUser(user: ApiUser | undefined) {
	return render(
		<MemoryRouter>
			<NavUser user={user} />
		</MemoryRouter>,
	);
}

describe('NavUser', () => {
	it('shows ellipsis when user is undefined', () => {
		renderNavUser(undefined);
		expect(screen.getByText('…')).toBeInTheDocument();
	});

	it('shows lastName + firstName when no middleName', () => {
		renderNavUser(baseUser);
		expect(screen.getByText('Petrov Ivan')).toBeInTheDocument();
	});

	it('shows lastName + firstName + middleName when middleName provided', () => {
		renderNavUser({ ...baseUser, middleName: 'Alexeevich' });
		expect(screen.getByText('Petrov Ivan Alexeevich')).toBeInTheDocument();
	});

	it('skips undefined middleName gracefully', () => {
		renderNavUser({ ...baseUser, middleName: undefined });
		expect(screen.getByText('Petrov Ivan')).toBeInTheDocument();
	});

	it('renders sidebar.open_settings i18n key', () => {
		renderNavUser(baseUser);
		expect(screen.getByText('sidebar.open_settings')).toBeInTheDocument();
	});
});
