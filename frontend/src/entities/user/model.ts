import { create } from 'zustand';

interface AuthState {
	isAuthenticated: boolean;
	token: string | null;
	login: (token: string) => void;
	logout: () => void;
}

// Auth is managed via httpOnly cookie + /users/me query.
// Token is never used at runtime — this store exists only for test compatibility.
export const useAuthStore = create<AuthState>()((_set) => ({
	isAuthenticated: false,
	token: null,
	login: () => {},
	logout: () => {},
}));
