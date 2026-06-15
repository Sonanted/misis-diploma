import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useIsMobile } from '../use-mobile';

function mockMatchMedia(matches: boolean, innerWidth: number) {
	Object.defineProperty(window, 'innerWidth', {
		writable: true,
		configurable: true,
		value: innerWidth,
	});

	const listeners = new Map<string, EventListener>();

	Object.defineProperty(window, 'matchMedia', {
		writable: true,
		configurable: true,
		value: vi.fn().mockReturnValue({
			matches,
			addEventListener: vi.fn((event: string, cb: EventListener) => listeners.set(event, cb)),
			removeEventListener: vi.fn(),
		}),
	});

	return listeners;
}

describe('useIsMobile', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('returns true on mobile viewport (< 768px)', () => {
		mockMatchMedia(true, 375);
		const { result } = renderHook(() => useIsMobile());
		expect(result.current).toBe(true);
	});

	it('returns false on desktop viewport (>= 768px)', () => {
		mockMatchMedia(false, 1280);
		const { result } = renderHook(() => useIsMobile());
		expect(result.current).toBe(false);
	});

	it('returns false exactly at 768px boundary', () => {
		mockMatchMedia(false, 768);
		const { result } = renderHook(() => useIsMobile());
		expect(result.current).toBe(false);
	});

	it('returns true just below 768px boundary', () => {
		mockMatchMedia(true, 767);
		const { result } = renderHook(() => useIsMobile());
		expect(result.current).toBe(true);
	});
});
