import { create } from 'zustand';

interface PrivacyState {
	balanceVisible: boolean;
	toggle: () => void;
}

export const usePrivacyStore = create<PrivacyState>((set) => ({
	balanceVisible: true,
	toggle: () => set((state) => ({ balanceVisible: !state.balanceVisible })),
}));
