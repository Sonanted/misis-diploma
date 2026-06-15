import { describe, expect, it } from 'vitest';
import { normalizeAmount } from '../utils';

describe('normalizeAmount', () => {
	it('parses integer string', () => {
		expect(normalizeAmount('100')).toBe(100);
	});

	it('parses decimal with dot', () => {
		expect(normalizeAmount('99.99')).toBe(99.99);
	});

	it('parses decimal with comma', () => {
		expect(normalizeAmount('99,99')).toBe(99.99);
	});

	it('returns 0 for empty string', () => {
		expect(normalizeAmount('')).toBe(0);
	});

	it('returns 0 for non-numeric input', () => {
		expect(normalizeAmount('abc')).toBe(0);
	});

	it('trims whitespace before parsing', () => {
		expect(normalizeAmount('  42  ')).toBe(42);
	});

	it('parses zero', () => {
		expect(normalizeAmount('0')).toBe(0);
	});

	it('parses large number', () => {
		expect(normalizeAmount('1000000')).toBe(1_000_000);
	});

	it('returns 0 for whitespace-only string', () => {
		expect(normalizeAmount('   ')).toBe(0);
	});
});
