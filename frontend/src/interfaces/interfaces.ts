export type AccountType = 'checking' | 'savings' | 'credit' | 'currency';
export type AccountStatus = 'active' | 'frozen';
export type AccountColor = 'emerald' | 'sky' | 'rose' | 'amber';

export interface Account {
	id: string;
	name: string;
	type: AccountType;
	accountNumber: string;
	currency: string;
	balance: number;
	color: AccountColor;
	lastTx: string;
	lastTxAmount: number;
	status: AccountStatus;
}

export interface Transaction {
	id: number;
	label: string;
	date: string;
	amount: number;
	category: string;
}

export interface ColorTokens {
	bg: string;
	text: string;
	border: string;
	dot: string;
	icon: string;
}
