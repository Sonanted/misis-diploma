import { beforeEach, describe, expect, it, vi } from 'vitest';
import { applyTheme } from '../theme';

describe('applyTheme', () => {
	beforeEach(() => {
		document.documentElement.classList.remove('dark');
	});

	it('adds dark class for dark theme', () => {
		applyTheme('dark');
		expect(document.documentElement.classList.contains('dark')).toBe(true);
	});

	it('removes dark class for light theme', () => {
		document.documentElement.classList.add('dark');
		applyTheme('light');
		expect(document.documentElement.classList.contains('dark')).toBe(false);
	});

	it('does not add dark class for light theme when already absent', () => {
		applyTheme('light');
		expect(document.documentElement.classList.contains('dark')).toBe(false);
	});

	it('applies dark for system when user prefers dark', () => {
		Object.defineProperty(window, 'matchMedia', {
			writable: true,
			configurable: true,
			value: vi.fn().mockReturnValue({ matches: true }),
		});
		applyTheme('system');
		expect(document.documentElement.classList.contains('dark')).toBe(true);
	});

	it('removes dark for system when user prefers light', () => {
		document.documentElement.classList.add('dark');
		Object.defineProperty(window, 'matchMedia', {
			writable: true,
			configurable: true,
			value: vi.fn().mockReturnValue({ matches: false }),
		});
		applyTheme('system');
		expect(document.documentElement.classList.contains('dark')).toBe(false);
	});
});
