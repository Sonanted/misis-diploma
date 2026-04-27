import { useState } from 'react';

import { ArrowDownLeft, ArrowUpRight, Eye, EyeOff } from 'lucide-react';

import { colorMap, formatBalance, maskAccountNumber, typeIcon } from '@/helpers/helpers';
import type { Account } from '@/interfaces/interfaces';

import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader } from './ui/card';
import { Separator } from './ui/separator';

interface AccountCardProps {
	account: Account;
	selected: boolean;
	onSelect: (id: string) => void;
}

export function AccountCard({ account, onSelect, selected }: AccountCardProps) {
	const [hidden, setHidden] = useState(false);
	const colors = colorMap[account.color];
	const Icon = typeIcon[account.type];
	const isNegative = account.balance < 0;

	return (
		<Card
			onClick={() => onSelect(account.id)}
			className={`relative cursor-pointer overflow-hidden transition-all duration-200 
        ${selected ? `${colors.border} shadow-md scale-[1.01]` : 'hover:border-border/80'}
      `}
		>
			{/* Accent strip */}
			<div
				className={`absolute top-0 left-0 right-0 h-[2px] ${colors.dot}
          ${selected ? 'opacity-100' : 'opacity-20'} transition-opacity`}
			/>

			<CardHeader className="pb-2 pt-5 px-5">
				<div className="flex items-start justify-between">
					<div className="flex items-center gap-3">
						<div className={`p-2 rounded-xl ${colors.bg}`}>
							<Icon size={18} className={colors.icon} />
						</div>
						<p className="text-sm font-semibold text-foreground leading-tight">{account.name}</p>
					</div>

					{account.status === 'frozen' && (
						<Badge variant="outline" className="text-[10px] px-1.5 py-0 text-muted-foreground">
							Заморожен
						</Badge>
					)}
				</div>
			</CardHeader>

			<CardContent className="px-5 pb-5 space-y-4">
				{/* Balance */}
				<div className="flex items-center gap-2">
					<span
						className={`text-2xl font-bold tracking-tight ${isNegative ? 'text-destructive' : 'text-foreground'}`}
					>
						{hidden ? '••••••' : formatBalance(account.balance, account.currency)}
					</span>
					<button
						onClick={(e) => {
							e.stopPropagation();
							setHidden((h) => !h);
						}}
						className="text-muted-foreground/50 hover:text-muted-foreground transition-colors"
					>
						{hidden ? <EyeOff size={14} /> : <Eye size={14} />}
					</button>
				</div>

				<Separator />

				{/* Account number + last tx */}
				<div className="flex items-center justify-between">
					<span className="text-xs text-muted-foreground font-mono tracking-widest">
						{maskAccountNumber(account.accountNumber)}
					</span>
					<div className="flex items-center gap-1">
						{account.lastTxAmount > 0 ? (
							<ArrowDownLeft size={12} className="text-emerald-500" />
						) : (
							<ArrowUpRight size={12} className="text-destructive" />
						)}
						<span
							className={`text-xs font-medium ${account.lastTxAmount > 0 ? 'text-emerald-500' : 'text-destructive'}`}
						>
							{account.lastTxAmount > 0 ? '+' : ''}
							{account.lastTxAmount.toLocaleString('ru-RU')} {account.currency}
						</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
