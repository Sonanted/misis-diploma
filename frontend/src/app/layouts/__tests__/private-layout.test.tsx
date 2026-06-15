import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import PrivateLayout from '../private-layout';

vi.mock('@/entities/account/queries', () => ({
	useBankInfo: vi.fn(() => ({ data: undefined })),
}));

vi.mock('@/widgets/sidebar/app-sidebar', () => ({
	AppSidebar: () => <nav>AppSidebar</nav>,
}));

vi.mock('@/widgets/sidebar/sidebar-inset-header', () => ({
	default: () => <header>SidebarInsetHeader</header>,
}));

vi.mock('@/shared/ui/sidebar', () => ({
	SidebarProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
	SidebarInset: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/shared/ui/scroll-area', () => ({
	ScrollArea: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('PrivateLayout', () => {
	it('renders sidebar', () => {
		render(
			<MemoryRouter initialEntries={['/']}>
				<Routes>
					<Route path="/" element={<PrivateLayout />}>
						<Route index element={<div>Child content</div>} />
					</Route>
				</Routes>
			</MemoryRouter>,
		);
		expect(screen.getByText('AppSidebar')).toBeInTheDocument();
	});

	it('renders sidebar inset header', () => {
		render(
			<MemoryRouter initialEntries={['/']}>
				<Routes>
					<Route path="/" element={<PrivateLayout />}>
						<Route index element={<div>Child content</div>} />
					</Route>
				</Routes>
			</MemoryRouter>,
		);
		expect(screen.getByText('SidebarInsetHeader')).toBeInTheDocument();
	});

	it('renders outlet content', () => {
		render(
			<MemoryRouter initialEntries={['/']}>
				<Routes>
					<Route path="/" element={<PrivateLayout />}>
						<Route index element={<div>Child content</div>} />
					</Route>
				</Routes>
			</MemoryRouter>,
		);
		expect(screen.getByText('Child content')).toBeInTheDocument();
	});
});
