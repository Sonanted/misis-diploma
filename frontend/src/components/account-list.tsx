import { Plus, Scroll } from 'lucide-react';

import type { Account } from '@/interfaces/interfaces';

import { AccountCard } from './account-card';
import { Button } from './ui/button';

interface AccountListProps {
	accounts: Account[];
	selectedId: string;
	onSelect: (id: string) => void;
}

export function AccountList({ accounts, selectedId, onSelect }: AccountListProps) {
	return (
		<div className="max-h-full space-y-3">
			{accounts.map((acc) => (
				<AccountCard
					key={acc.id}
					account={acc}
					selected={selectedId === acc.id}
					onSelect={onSelect}
				/>
			))}

			<Button variant="outline" className="w-full border-dashed gap-2 mt-1 text-muted-foreground">
				<Plus size={15} />
				Добавить счёт
			</Button>
		</div>
	);
}
