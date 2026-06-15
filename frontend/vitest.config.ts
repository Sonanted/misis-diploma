import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@shared': path.resolve(__dirname, '../shared/api'),
		},
	},
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./src/test/setup.ts'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'html'],
			include: ['src/**/*.{ts,tsx}'],
			exclude: [
				'src/test/**',
				'src/main.tsx',
				'src/vite-env.d.ts',
				'src/**/*.d.ts',
				'src/shared/ui/**',
				'src/app/router/routes.tsx',
				'src/shared/api/client.ts',
				'src/shared/lib/i18n.ts',
			],
		},
	},
});
