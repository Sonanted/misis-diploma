import { Building2, CreditCard, Landmark, type LucideIcon, Wallet } from 'lucide-react';

import type { AccountColor, AccountType, ColorTokens } from '../types';

export const colorMap: Record<AccountColor, ColorTokens> = {
	emerald: {
		bg: 'bg-emerald-500/10',
		text: 'text-emerald-400',
		border: 'border-emerald-500/20',
		dot: 'bg-emerald-400',
		icon: 'text-emerald-400',
	},
	sky: {
		bg: 'bg-sky-500/10',
		text: 'text-sky-400',
		border: 'border-sky-500/20',
		dot: 'bg-sky-400',
		icon: 'text-sky-400',
	},
	rose: {
		bg: 'bg-rose-500/10',
		text: 'text-rose-400',
		border: 'border-rose-500/20',
		dot: 'bg-rose-400',
		icon: 'text-rose-400',
	},
	amber: {
		bg: 'bg-amber-500/10',
		text: 'text-amber-400',
		border: 'border-amber-500/20',
		dot: 'bg-amber-400',
		icon: 'text-amber-400',
	},
};

export const typeIcon: Record<AccountType, LucideIcon> = {
	checking: Wallet,
	savings: Landmark,
	credit: CreditCard,
	currency: Building2,
};

// Показываем только последние 4 цифры счёта
export function maskAccountNumber(num: string): string {
	return `•• ${num.slice(-4)}`;
}

export function formatBalance(val: number, currency: string): string {
	const abs = Math.abs(val).toLocaleString('ru-RU', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
	return `${val < 0 ? '−' : ''}${abs} ${currency}`;
}
