import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('react-router', () => ({
	RouterProvider: () => <div>RouterProvider</div>,
}));

vi.mock('@/shared/ui/sonner', () => ({
	Toaster: () => null,
}));

vi.mock('../routes', () => ({
	router: {},
}));

import { AppRouter } from '../AppRouter';

describe('AppRouter', () => {
	it('renders without crashing', () => {
		const { container } = render(<AppRouter />);
		expect(container.firstChild).toBeInTheDocument();
	});

	it('renders RouterProvider', () => {
		const { getByText } = render(<AppRouter />);
		expect(getByText('RouterProvider')).toBeInTheDocument();
	});
});
