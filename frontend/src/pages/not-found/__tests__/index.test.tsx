import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithRouter } from '@/test/test-utils';
import { NotFound } from '../index';

describe('NotFound', () => {
	it('renders with default i18n keys when no props given', () => {
		renderWithRouter(<NotFound />);
		// i18n returns the key itself since no translations loaded
		expect(screen.getByText('not_found.title')).toBeInTheDocument();
		expect(screen.getByText('not_found.description')).toBeInTheDocument();
		expect(screen.getByText('not_found.back')).toBeInTheDocument();
	});

	it('renders custom title and description', () => {
		renderWithRouter(<NotFound title="Account not found" description="This account does not exist" />);
		expect(screen.getByText('Account not found')).toBeInTheDocument();
		expect(screen.getByText('This account does not exist')).toBeInTheDocument();
	});

	it('renders custom back label', () => {
		renderWithRouter(<NotFound backLabel="Go home" />);
		expect(screen.getByText('Go home')).toBeInTheDocument();
	});

	it('back button links to /accounts by default', () => {
		renderWithRouter(<NotFound backLabel="Back" />);
		const link = screen.getByRole('link', { name: /Back/i });
		expect(link).toHaveAttribute('href', '/accounts');
	});

	it('back button links to custom backTo path', () => {
		renderWithRouter(<NotFound backLabel="Back" backTo="/cards" />);
		const link = screen.getByRole('link', { name: /Back/i });
		expect(link).toHaveAttribute('href', '/cards');
	});

	it('renders an alert icon', () => {
		const { container } = renderWithRouter(<NotFound />);
		const svg = container.querySelector('svg');
		expect(svg).toBeInTheDocument();
	});
});
