export type EAccountType = 'checking' | 'savings' | 'credit' | 'currency';
export type EAccountStatus = 'active' | 'blocked' | 'closed';
export type EAccountCurrency = 'RUB' | 'USD' | 'EUR';
export type ECardType = 'Debit' | 'Credit';
export type ECardStatus = 'Active' | 'Locked' | 'Closed';

export interface ApiUser {
	id: string;
	firstName: string;
	lastName: string;
	middleName?: string;
	email: string;
	phone: string;
	primaryAccountId: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface ApiAccount {
	id: string;
	name: string;
	accountNumber: string;
	type: EAccountType;
	status: EAccountStatus;
	balance: number;
	currency: EAccountCurrency;
	interestRate?: number;
	creditLimit: number | null;
	createdAt: string;
	updatedAt: string;
}

export interface ApiCard {
	id: string;
	name: string;
	cardNumber: string;
	expiryDate: string;
	type: ECardType;
	status: ECardStatus;
	currency: EAccountCurrency;
	balance: number;
	creditLimit: number | null;
	availableCredit: number | null;
	cardHolder: string;
	linkedAccountId: string;
	linkedAccountName: string;
}

export interface ApiCardDetail extends ApiCard {
	fullNumber: string;
	cvv: string;
	pin: string;
}

export interface AuthResponse {
	access_token: string;
}

export type EOperationType =
	| 'transfer'
	| 'topup'
	| 'monthly_payment'
	| 'card_issued'
	| 'card_closed'
	| 'card_locked'
	| 'card_unlocked'
	| 'card_pin_changed';

export interface ApiOperation {
	id: string;
	type: EOperationType;
	amount: number | null;
	fromAccountId: string | null;
	fromAccountNumber: string | null;
	toAccountId: string | null;
	toAccountNumber: string | null;
	relatedCardId: string | null;
	relatedAccountId: string | null;
	userId: string;
	description: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface PaginatedOperations {
	items: ApiOperation[];
	total: number;
	limit: number;
	offset: number;
}
