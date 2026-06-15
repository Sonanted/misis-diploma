import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, type RenderOptions } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router';

function createQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: { retry: false, gcTime: 0, staleTime: 0 },
			mutations: { retry: false },
		},
	});
}

function Wrapper({ children }: { children: ReactNode }) {
	return (
		<QueryClientProvider client={createQueryClient()}>
			<MemoryRouter>{children}</MemoryRouter>
		</QueryClientProvider>
	);
}

export function renderWithRouter(ui: ReactNode, options?: RenderOptions) {
	return render(ui, { wrapper: Wrapper, ...options });
}
