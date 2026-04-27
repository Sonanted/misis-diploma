import { ArrowDownLeft, ArrowUpRight, History, Trash2 } from 'lucide-react';

import { colorMap, formatBalance, typeIcon } from '@/helpers/helpers';
import type { Account, Transaction } from '@/interfaces/interfaces';

import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Separator } from './ui/separator';

interface AccountDetailProps {
	account: Account;
	onHistory?: () => void;
	onClose?: () => void;
}

export function AccountDetail({ account, onHistory, onClose }: AccountDetailProps) {
	const colors = colorMap[account.color];
	const Icon = typeIcon[account.type];

	const transactions: Transaction[] = [
		{ id: 1, label: 'Яндекс Маркет', date: 'Сегодня, 14:32', amount: -3200, category: 'Покупки' },
		{ id: 2, label: 'Зарплата', date: 'Вчера, 09:00', amount: +85000, category: 'Доход' },
		{ id: 3, label: 'ВкусВилл', date: '23 апр, 19:11', amount: -1840, category: 'Продукты' },
		{ id: 4, label: 'Кофемания', date: '22 апр, 08:45', amount: -420, category: 'Кафе' },
		{ id: 5, label: 'Wildberries', date: '21 апр, 17:03', amount: -5600, category: 'Покупки' },
	];

	return (
		<Card className="h-full">
			<CardHeader className="px-6 pt-6 pb-4">
				<div className="flex items-center gap-4">
					<div className={`p-3 rounded-2xl ${colors.bg}`}>
						<Icon size={22} className={colors.icon} />
					</div>
					<div>
						<h2 className="text-lg font-bold text-foreground">{account.name}</h2>
						<p className="text-sm text-muted-foreground font-mono tracking-wider">
							{account.accountNumber}
						</p>
					</div>
				</div>
			</CardHeader>

			<CardContent className="px-6 pb-6 space-y-6">
				{/* Balance block */}
				<div className={`rounded-2xl p-5 ${colors.bg} border ${colors.border}`}>
					<p className="text-xs text-muted-foreground mb-1 uppercase tracking-widest">Баланс</p>
					<p
						className={`text-3xl font-extrabold tracking-tight ${account.balance < 0 ? 'text-destructive' : 'text-foreground'}`}
					>
						{formatBalance(account.balance, account.currency)}
					</p>
				</div>

				{/* Quick actions */}
				<div className="grid grid-cols-2 gap-3">
					<Button variant="outline" className="gap-2">
						<ArrowUpRight size={15} />
						Перевести
					</Button>
					<Button variant="outline" className="gap-2">
						<ArrowDownLeft size={15} />
						Пополнить
					</Button>
				</div>

				{/* Secondary actions */}
				<div className="grid grid-cols-2 gap-3">
					<Button
						variant="ghost"
						onClick={onHistory}
						className="gap-2 justify-start text-muted-foreground hover:text-foreground"
					>
						<History size={15} />
						История операций
					</Button>
					<Button
						variant="ghost"
						onClick={onClose}
						className="gap-2 justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
					>
						<Trash2 size={15} />
						Закрыть счёт
					</Button>
				</div>

				<Separator />

				{/* Transactions */}
				<div>
					<p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
						Последние операции
					</p>
					<div className="space-y-1">
						{transactions.map((tx) => (
							<div
								key={tx.id}
								className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-muted/50 transition-colors"
							>
								<div>
									<p className="text-sm font-medium text-foreground">{tx.label}</p>
									<p className="text-xs text-muted-foreground">{tx.date}</p>
								</div>
								<div className="text-right">
									<p
										className={`text-sm font-semibold ${tx.amount > 0 ? 'text-emerald-500' : 'text-foreground'}`}
									>
										{tx.amount > 0 ? '+' : ''}
										{tx.amount.toLocaleString('ru-RU')} {account.currency}
									</p>
									<p className="text-xs text-muted-foreground/60">{tx.category}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
