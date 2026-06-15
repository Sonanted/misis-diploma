import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { logout as logoutApi, signin, signup } from '@/shared/api/auth';
import type { ChangePasswordDto, UpdateUserDto } from '@/shared/api/users';
import { changePassword, getMe, updateMe } from '@/shared/api/users';

export const userKeys = {
	me: ['me'] as const,
};

export function useMe() {
	return useQuery({
		queryKey: userKeys.me,
		queryFn: getMe,
		retry: false,       // 401 = not authenticated, no point retrying
		staleTime: 5 * 60 * 1000,
	});
}

export function useSignin() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: signin,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: userKeys.me });
			navigate('/');
		},
	});
}

export function useSignup() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: signup,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: userKeys.me });
			navigate('/');
		},
	});
}

export function useLogout() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: logoutApi,
		onSuccess: () => {
			queryClient.clear();
			navigate('/login');
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
