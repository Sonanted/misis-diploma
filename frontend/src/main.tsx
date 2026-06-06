import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.tsx';
import './shared/lib/i18n.ts';

import './index.css';

const root = document.getElementById('root');

if (root === null) throw new Error('Failed to find the root element');

createRoot(root).render(
	<StrictMode>
		<App />
	</StrictMode>
);
