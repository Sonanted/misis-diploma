// Балансовые счета по плану счетов ЦБ РФ (Положение 579-П)
export const BALANCE_SHEET_ACCOUNTS: Record<string, { code: string; name: string }> = {
	checking: { code: '40817', name: 'Текущий счёт физического лица' },
	savings: { code: '42301', name: 'Вклад (депозит) до востребования' },
	loan: { code: '45508', name: 'Кредит физическому лицу' },
	deposit: { code: '42306', name: 'Срочный депозит физического лица' },
};

// Коды валют ISO 4217 numeric
export const CURRENCY_CODES: Record<string, string> = {
	RUB: '810',
	USD: '840',
	EUR: '978',
};

// ── Конфигурация банка ────────────────────────────────────────────────────────
// В реальном приложении выносится в ConfigService / .env
export const BANK_CONFIG = {
	BIK: '044525999',
	NAME: 'Yet Another Bank',
	BRANCH_CODE: '1234',
} as const;

export const ACCOUNT_NUMBER_WEIGHTS = [
	7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1,
] as const;
