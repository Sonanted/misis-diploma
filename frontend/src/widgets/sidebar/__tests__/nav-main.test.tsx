import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { NavMain } from '../nav-main';

vi.mock('@/shared/ui/sidebar', () => ({
	SidebarGroup: ({ children }: { children: ReactNode }) => <div>{children}</div>,
	SidebarMenu: ({ children }: { children: ReactNode }) => <ul>{children}</ul>,
	SidebarMenuItem: ({ children }: { children: ReactNode }) => <li>{children}</li>,
	SidebarMenuButton: ({ children, isActive }: { children: ReactNode; isActive?: boolean }) => (
		<button type="button" data-active={isActive}>{children}</button>
	),
}));

const items = [
	{ title: 'Dashboard', url: '/', icon: <span>icon1</span> },
	{ title: 'Cards', url: '/cards', icon: <span>icon2</span> },
	{ title: 'Operations', url: '/operations', icon: <span>icon3</span> },
];

describe('NavMain', () => {
	it('renders all nav item titles', () => {
		render(
			<MemoryRouter>
				<NavMain items={items} activeUrl="/" onItemClick={vi.fn()} />
			</MemoryRouter>,
		);
		expect(screen.getByText('Dashboard')).toBeInTheDocument();
		expect(screen.getByText('Cards')).toBeInTheDocument();
		expect(screen.getByText('Operations')).toBeInTheDocument();
	});

	it('renders correct number of nav items', () => {
		render(
			<MemoryRouter>
				<NavMain items={items} activeUrl="/" onItemClick={vi.fn()} />
			</MemoryRouter>,
		);
		expect(screen.getAllByRole('button')).toHaveLength(3);
	});

	it('renders links with correct hrefs', () => {
		render(
			<MemoryRouter>
				<NavMain items={items} activeUrl="/" onItemClick={vi.fn()} />
			</MemoryRouter>,
		);
		expect(screen.getByRole('link', { name: /Dashboard/i })).toHaveAttribute('href', '/');
		expect(screen.getByRole('link', { name: /Cards/i })).toHaveAttribute('href', '/cards');
	});

	it('renders icons', () => {
		render(
			<MemoryRouter>
				<NavMain items={items} activeUrl="/" onItemClick={vi.fn()} />
			</MemoryRouter>,
		);
		expect(screen.getByText('icon1')).toBeInTheDocument();
		expect(screen.getByText('icon2')).toBeInTheDocument();
	});

	it('renders empty list without crashing', () => {
		const { container } = render(
			<MemoryRouter>
				<NavMain items={[]} activeUrl="/" onItemClick={vi.fn()} />
			</MemoryRouter>,
		);
		expect(container).toBeInTheDocument();
	});
});
