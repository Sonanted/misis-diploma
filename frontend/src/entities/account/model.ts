import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AccountStore {
	primaryAccountId: string | null;
	setPrimaryAccount: (id: string) => void;
}

export const useAccountStore = create<AccountStore>()(
	persist(
		(set) => ({
			primaryAccountId: '1',
			setPrimaryAccount: (id) => set({ primaryAccountId: id }),
		}),
		{ name: 'account-settings' },
	),
);
