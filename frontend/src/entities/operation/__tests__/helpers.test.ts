import { describe, expect, it } from 'vitest';
import type { ApiOperation } from '@/shared/api/types';
import { operationToTransactionItem } from '../helpers';

const t = (key: string) => key;

const userAccounts = new Set(['acc1', 'acc2']);

const baseOp: ApiOperation = {
	id: 'op1',
	type: 'topup',
	amount: 500,
	fromAccountId: null,
	fromAccountNumber: null,
	toAccountId: 'acc1',
	toAccountNumber: '12345678',
	relatedCardId: null,
	relatedAccountId: null,
	userId: 'usr1',
	description: null,
	createdAt: '2024-06-01T10:30:00.000Z',
	updatedAt: '2024-06-01T10:30:00.000Z',
};

describe('operationToTransactionItem', () => {
	describe('direction resolution (global mode)', () => {
		it('topup → incoming, positive amount', () => {
			const item = operationToTransactionItem(baseOp, t, userAccounts);
			expect(item.type).toBe('incoming');
			expect(item.amount).toBe(500);
		});

		it('monthly_payment → outgoing, negative amount', () => {
			const op: ApiOperation = { ...baseOp, type: 'monthly_payment', fromAccountId: 'acc1' };
			const item = operationToTransactionItem(op, t, userAccounts);
			expect(item.type).toBe('outgoing');
			expect(item.amount).toBe(-500);
		});

		it('transfer between own accounts → internal, unsigned amount', () => {
			const op: ApiOperation = {
				...baseOp,
				type: 'transfer',
				fromAccountId: 'acc1',
				toAccountId: 'acc2',
			};
			const item = operationToTransactionItem(op, t, userAccounts);
			expect(item.type).toBe('internal');
			expect(item.amount).toBe(500);
		});

		it('transfer to external account → outgoing, negative amount', () => {
			const op: ApiOperation = {
				...baseOp,
				type: 'transfer',
				fromAccountId: 'acc1',
				toAccountId: 'ext_acc',
			};
			const item = operationToTransactionItem(op, t, userAccounts);
			expect(item.type).toBe('outgoing');
			expect(item.amount).toBe(-500);
		});

		it('transfer from external account → incoming, positive amount', () => {
			const op: ApiOperation = {
				...baseOp,
				type: 'transfer',
				fromAccountId: 'ext_acc',
				toAccountId: 'acc1',
			};
			const item = operationToTransactionItem(op, t, userAccounts);
			expect(item.type).toBe('incoming');
			expect(item.amount).toBe(500);
		});

		it('card_issued type → null direction → "other" type', () => {
			const op: ApiOperation = { ...baseOp, type: 'card_issued', amount: null };
			const item = operationToTransactionItem(op, t, userAccounts);
			expect(item.type).toBe('other');
			expect(item.amount).toBe(0);
		});
	});

	describe('direction resolution (viewAccountId mode)', () => {
		it('viewAccountId is toAccountId → incoming', () => {
			const op: ApiOperation = {
				...baseOp,
				type: 'transfer',
				fromAccountId: 'acc1',
				toAccountId: 'acc2',
			};
			const item = operationToTransactionItem(op, t, userAccounts, 'acc2');
			expect(item.type).toBe('incoming');
			expect(item.amount).toBe(500);
		});

		it('viewAccountId is fromAccountId → outgoing', () => {
			const op: ApiOperation = {
				...baseOp,
				type: 'transfer',
				fromAccountId: 'acc1',
				toAccountId: 'acc2',
			};
			const item = operationToTransactionItem(op, t, userAccounts, 'acc1');
			expect(item.type).toBe('outgoing');
			expect(item.amount).toBe(-500);
		});

		it('viewAccountId unrelated → null direction → "other"', () => {
			const op: ApiOperation = {
				...baseOp,
				type: 'transfer',
				fromAccountId: 'acc1',
				toAccountId: 'acc2',
			};
			const item = operationToTransactionItem(op, t, userAccounts, 'ext_acc');
			expect(item.type).toBe('other');
		});
	});

	describe('metadata', () => {
		it('extracts date (YYYY-MM-DD) from createdAt', () => {
			const item = operationToTransactionItem(baseOp, t, userAccounts);
			expect(item.date).toBe('2024-06-01');
		});

		it('uses provided description', () => {
			const op: ApiOperation = { ...baseOp, description: 'Custom note' };
			const item = operationToTransactionItem(op, t, userAccounts);
			expect(item.description).toBe('Custom note');
		});

		it('falls back to translated key when description is null', () => {
			const item = operationToTransactionItem(baseOp, t, userAccounts);
			expect(item.description).toBe('operations.type_topup');
		});

		it('preserves operation id', () => {
			const item = operationToTransactionItem(baseOp, t, userAccounts);
			expect(item.id).toBe('op1');
		});

		it('sets toAccountNumber on item', () => {
			const item = operationToTransactionItem(baseOp, t, userAccounts);
			expect(item.toAccountNumber).toBe('12345678');
		});

		it('amount is 0 when op.amount is null', () => {
			const op: ApiOperation = { ...baseOp, amount: null };
			const item = operationToTransactionItem(op, t, userAccounts);
			expect(item.amount).toBe(0);
		});
	});
});
