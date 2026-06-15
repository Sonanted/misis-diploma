import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/app/router/AppRouter', () => ({
	AppRouter: () => <div>AppRouter</div>,
}));

import App from '../App';

describe('App', () => {
	it('renders without crashing', () => {
		const { container } = render(<App />);
		expect(container.firstChild).toBeInTheDocument();
	});

	it('renders AppRouter', () => {
		const { getByText } = render(<App />);
		expect(getByText('AppRouter')).toBeInTheDocument();
	});
});
