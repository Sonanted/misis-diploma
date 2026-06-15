import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import SidebarInsetHeader from '../sidebar-inset-header';

// vi.hoisted ensures the variable is available inside vi.mock factory (which is hoisted to top)
const mockUseMatches = vi.hoisted(() =>
	vi.fn(() => [] as ReturnType<typeof import('react-router').useMatches>),
);
vi.mock('react-router', async (importOriginal) => {
	const actual = await importOriginal<typeof import('react-router')>();
	return { ...actual, useMatches: mockUseMatches };
});

vi.mock('@/shared/ui/sidebar', () => ({
	SidebarTrigger: () => <button type="button">sidebar-trigger</button>,
}));

vi.mock('@/shared/ui/separator', () => ({
	Separator: () => <hr />,
}));

vi.mock('@/shared/ui/breadcrumb', () => ({
	Breadcrumb: ({ children }: { children: ReactNode }) => <nav>{children}</nav>,
	BreadcrumbList: ({ children }: { children: ReactNode }) => <ol>{children}</ol>,
	BreadcrumbItem: ({ children }: { children: ReactNode }) => <li>{children}</li>,
	BreadcrumbLink: ({ render: renderProp }: { render?: ReactNode }) => <a href="/test">{renderProp}</a>,
	BreadcrumbPage: ({ children }: { children: ReactNode }) => <span>{children}</span>,
	BreadcrumbSeparator: () => <span aria-hidden>/</span>,
}));

function renderHeader() {
	return render(
		<MemoryRouter>
			<SidebarInsetHeader />
		</MemoryRouter>,
	);
}

describe('SidebarInsetHeader', () => {
	it('renders sidebar trigger button', () => {
		mockUseMatches.mockReturnValue([]);
		renderHeader();
		expect(screen.getByText('sidebar-trigger')).toBeInTheDocument();
	});

	it('renders header element', () => {
		mockUseMatches.mockReturnValue([]);
		const { container } = renderHeader();
		expect(container.querySelector('header')).toBeInTheDocument();
	});

	it('renders without breadcrumbs when matches have no handle', () => {
		mockUseMatches.mockReturnValue([]);
		renderHeader();
		expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
	});

	it('renders breadcrumb page for the last match with string breadcrumb', () => {
		mockUseMatches.mockReturnValue([
			{ id: '0', pathname: '/dashboard', params: {}, data: undefined, handle: { breadcrumb: 'sidebar.dashboard' } },
		]);
		renderHeader();
		expect(screen.getByText('sidebar.dashboard')).toBeInTheDocument();
	});

	it('renders breadcrumb link for non-last matches', () => {
		mockUseMatches.mockReturnValue([
			{ id: '0', pathname: '/dashboard', params: {}, data: undefined, handle: { breadcrumb: 'sidebar.dashboard' } },
			{ id: '1', pathname: '/dashboard/detail', params: {}, data: undefined, handle: { breadcrumb: 'sidebar.detail' } },
		]);
		renderHeader();
		expect(screen.getByText('sidebar.dashboard')).toBeInTheDocument();
		expect(screen.getByText('sidebar.detail')).toBeInTheDocument();
	});
});
