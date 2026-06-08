import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRouter } from './app/router/AppRouter';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 1,
			staleTime: 60_000,
		},
	},
});

const App = () => (
	<QueryClientProvider client={queryClient}>
		<AppRouter />
	</QueryClientProvider>
);

export default App;
