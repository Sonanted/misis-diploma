import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { signin, signup } from '@/shared/api/auth';
import { changePassword, getMe, updateMe } from '@/shared/api/users';
import type { ChangePasswordDto, UpdateUserDto } from '@/shared/api/users';
import { useAuthStore } from './model';

export const userKeys = {
	me: ['me'] as const,
};

export function useMe() {
	const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
	return useQuery({
		queryKey: userKeys.me,
		queryFn: getMe,
		enabled: isAuthenticated,
	});
}

export function useSignin() {
	const login = useAuthStore((s) => s.login);
	const navigate = useNavigate();

	return useMutation({
		mutationFn: signin,
		onSuccess: (data) => {
			login(data.access_token);
			navigate('/');
		},
	});
}

export function useSignup() {
	const login = useAuthStore((s) => s.login);
	const navigate = useNavigate();

	return useMutation({
		mutationFn: signup,
		onSuccess: (data) => {
			login(data.access_token);
			navigate('/');
		},
	});
}

export function useUpdateMe() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (dto: UpdateUserDto) => updateMe(dto),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: userKeys.me });
		},
	});
}

export function useChangePassword() {
	return useMutation({
		mutationFn: (dto: ChangePasswordDto) => changePassword(dto),
	});
}
