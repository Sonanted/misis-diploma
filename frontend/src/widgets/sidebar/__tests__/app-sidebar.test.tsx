import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { AppSidebar } from '../app-sidebar';

vi.mock('@/entities/user/queries', () => ({
	useMe: vi.fn(() => ({ data: { firstName: 'John', lastName: 'Doe' } })),
}));

vi.mock('@/shared/ui/sidebar', () => ({
	Sidebar: ({ children }: { children: React.ReactNode }) => <aside>{children}</aside>,
	SidebarHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
	SidebarContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
	SidebarFooter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
	SidebarMenu: ({ children }: { children: React.ReactNode }) => <ul>{children}</ul>,
	SidebarMenuItem: ({ children }: { children: React.ReactNode }) => <li>{children}</li>,
}));

vi.mock('../nav-main', () => ({
	NavMain: ({ items }: { items: { title: string }[] }) => (
		<ul>
			{items.map((item) => (
				<li key={item.title}>{item.title}</li>
			))}
		</ul>
	),
}));

vi.mock('../nav-user', () => ({
	NavUser: () => <div>NavUser</div>,
}));

describe('AppSidebar', () => {
	it('renders without crashing', () => {
		const { container } = render(
			<MemoryRouter>
				<AppSidebar />
			</MemoryRouter>,
		);
		expect(container.firstChild).toBeInTheDocument();
	});

	it('renders app name', () => {
		render(
			<MemoryRouter>
				<AppSidebar />
			</MemoryRouter>,
		);
		expect(screen.getByText('sidebar.app_name')).toBeInTheDocument();
	});

	it('renders navigation items', () => {
		render(
			<MemoryRouter>
				<AppSidebar />
			</MemoryRouter>,
		);
		expect(screen.getByText('sidebar.dashboard')).toBeInTheDocument();
		expect(screen.getByText('sidebar.cards')).toBeInTheDocument();
		expect(screen.getByText('sidebar.operations')).toBeInTheDocument();
		expect(screen.getByText('sidebar.payments')).toBeInTheDocument();
	});

	it('renders NavUser component', () => {
		render(
			<MemoryRouter>
				<AppSidebar />
			</MemoryRouter>,
		);
		expect(screen.getByText('NavUser')).toBeInTheDocument();
	});
});
