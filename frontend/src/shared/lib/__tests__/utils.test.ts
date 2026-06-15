import { describe, expect, it } from 'vitest';
import { cn } from '../utils';

describe('cn', () => {
	it('joins class names', () => {
		expect(cn('foo', 'bar')).toBe('foo bar');
	});

	it('ignores falsy values', () => {
		expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
	});

	it('handles undefined and null', () => {
		expect(cn(undefined, null, 'foo')).toBe('foo');
	});

	it('deduplicates conflicting tailwind classes (last wins)', () => {
		expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
	});

	it('merges non-conflicting tailwind classes', () => {
		const result = cn('px-4', 'py-2');
		expect(result).toContain('px-4');
		expect(result).toContain('py-2');
	});

	it('handles empty call', () => {
		expect(cn()).toBe('');
	});

	it('handles object syntax', () => {
		expect(cn({ foo: true, bar: false })).toBe('foo');
	});

	it('handles array syntax', () => {
		expect(cn(['foo', 'bar'])).toBe('foo bar');
	});
});
