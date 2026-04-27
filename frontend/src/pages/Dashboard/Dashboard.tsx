import { useState } from 'react';

import { AccountDetail } from '@/components/account-detail';
import { AccountList } from '@/components/account-list';
import { Badge } from '@/components/ui/badge';
import type { Account } from '@/interfaces/interfaces';

export default function Dashboard() {
	const ACCOUNTS: Account[] = [
		{
			id: '1',
			name: 'Расчётный счёт',
			type: 'checking',
			accountNumber: '40817810900012345678',
			currency: '₽',
			balance: 128_450.75,
			color: 'emerald',
			lastTx: 'Пополнение',
			lastTxAmount: +15000,
			status: 'active',
		},
		{
			id: '2',
			name: 'Накопительный',
			type: 'savings',
			accountNumber: '42301810500087654321',
			currency: '₽',
			balance: 540_000.0,
			color: 'sky',
			lastTx: 'Процент',
			lastTxAmount: +812,
			status: 'active',
		},
		{
			id: '3',
			name: 'Кредитный счёт',
			type: 'credit',
			accountNumber: '45506810200034567890',
			currency: '₽',
			balance: -22_300.0,
			color: 'rose',
			lastTx: 'Оплата',
			lastTxAmount: -4500,
			status: 'active',
		},
		{
			id: '4',
			name: 'Валютный счёт',
			type: 'currency',
			accountNumber: '40817840100056781234',
			currency: '$',
			balance: 3_200.0,
			color: 'amber',
			lastTx: 'Конвертация',
			lastTxAmount: +200,
			status: 'frozen',
		},
	];

	const [selectedId, setSelectedId] = useState<string>(ACCOUNTS[0].id);
	const selected = ACCOUNTS.find((a) => a.id === selectedId);

	const totalBalance = ACCOUNTS.reduce((sum, a) => {
		if (a.currency === '₽') return sum + a.balance;
		return sum;
	}, 0);

	return (
		<>
			<div className="mb-8">
				<p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Мои счета</p>
				<h1 className="text-3xl font-extrabold tracking-tight">
					{totalBalance.toLocaleString('ru-RU', { minimumFractionDigits: 2 })} ₽
				</h1>
				<p className="text-sm text-muted-foreground mt-1">Общий баланс в рублях</p>
			</div>

				<AccountList accounts={ACCOUNTS} selectedId={selectedId} onSelect={setSelectedId} />
				{/* {selected && (
					<AccountDetail
						account={selected}
						onHistory={() => alert(`История счёта: ${selected.name}`)}
						onClose={() => alert(`Закрыть счёт: ${selected.name}`)}
					/>
				)} */}
		</>
	);
}