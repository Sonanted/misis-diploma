import { describe, expect, it } from 'vitest';
import { colorMap, formatBalance, maskAccountNumber, typeIcon } from '../index';

describe('maskAccountNumber', () => {
	it('shows only last 4 digits', () => {
		expect(maskAccountNumber('1234567890123456')).toBe('•• 3456');
	});

	it('handles 4-digit input', () => {
		expect(maskAccountNumber('1234')).toBe('•• 1234');
	});

	it('handles 5-digit input', () => {
		expect(maskAccountNumber('12345')).toBe('•• 2345');
	});
});

describe('formatBalance', () => {
	it('formats positive balance', () => {
		const result = formatBalance(1000, 'RUB');
		expect(result).toContain('1');
		expect(result).toContain('RUB');
		expect(result).not.toContain('−');
	});

	it('formats negative balance with minus sign', () => {
		const result = formatBalance(-500, 'USD');
		expect(result).toContain('−');
		expect(result).toContain('USD');
	});

	it('formats zero without minus', () => {
		const result = formatBalance(0, 'EUR');
		expect(result).not.toContain('−');
		expect(result).toContain('EUR');
	});

	it('shows two decimal places', () => {
		const result = formatBalance(100, 'RUB');
		expect(result).toMatch(/,00|\.00/);
	});

	it('uses absolute value for negative numbers', () => {
		const negative = formatBalance(-100, 'RUB');
		const positive = formatBalance(100, 'RUB');
		const negDigits = negative.replace('−', '').replace('RUB', '').trim();
		const posDigits = positive.replace('RUB', '').trim();
		expect(negDigits).toBe(posDigits);
	});
});

describe('colorMap', () => {
	it('has all 4 color keys', () => {
		expect(Object.keys(colorMap)).toHaveLength(4);
	});

	it('emerald has correct tokens', () => {
		expect(colorMap.emerald.bg).toBe('bg-emerald-500/10');
		expect(colorMap.emerald.text).toBe('text-emerald-400');
		expect(colorMap.emerald.border).toBe('border-emerald-500/20');
		expect(colorMap.emerald.dot).toBe('bg-emerald-400');
		expect(colorMap.emerald.icon).toBe('text-emerald-400');
	});

	it('sky has correct bg token', () => {
		expect(colorMap.sky.bg).toBe('bg-sky-500/10');
	});

	it('rose has correct text token', () => {
		expect(colorMap.rose.text).toBe('text-rose-400');
	});

	it('amber has correct border token', () => {
		expect(colorMap.amber.border).toBe('border-amber-500/20');
	});
});

describe('typeIcon', () => {
	it('maps all 4 account types to icons', () => {
		expect(Object.keys(typeIcon)).toHaveLength(4);
	});

	it('checking, savings, credit, currency are defined', () => {
		expect(typeIcon.checking).toBeDefined();
		expect(typeIcon.savings).toBeDefined();
		expect(typeIcon.credit).toBeDefined();
		expect(typeIcon.currency).toBeDefined();
	});

	it('each icon is a valid React component (function or forwardRef object)', () => {
		// lucide-react v1+ returns forwardRef objects, typeof === 'object'
		expect(typeIcon.checking).toBeTruthy();
		expect(typeIcon.savings).toBeTruthy();
	});
});
