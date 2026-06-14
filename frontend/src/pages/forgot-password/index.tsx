import axios from 'axios';
import type { ComponentProps } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { CodeStep } from '@/features/auth/forgot-password/CodeStep';
import { PasswordStep } from '@/features/auth/forgot-password/PasswordStep';
import { PhoneStep } from '@/features/auth/forgot-password/PhoneStep';
import * as authApi from '@/shared/api/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';

export default function ForgotPassword({ ...props }: ComponentProps<typeof Card>) {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [step, setStep] = useState(1);
	const [phone, setPhone] = useState('');
	const [code, setCode] = useState('');
	const [loading, setLoading] = useState(false);

	const handleSendCode = async (data: { phone: string }) => {
		setLoading(true);
		try {
			const { code } = await authApi.requestPasswordReset(data.phone);
			if (code) toast.info(`(demo: ${code})`);
		} catch {
			// intentionally swallow — never reveal whether the phone exists
		} finally {
			setLoading(false);
		}
		setPhone(data.phone);
		setStep(2);
	};

	const handleVerifyCode = async (data: { code: string }) => {
		setLoading(true);
		try {
			await authApi.verifyResetCode(phone, data.code);
			setCode(data.code);
			setStep(3);
		} catch {
			toast.error(t('auth.forgot_password.invalid_code'));
		} finally {
			setLoading(false);
		}
	};

	const handleResetPassword = async (data: { newPassword: string }) => {
		setLoading(true);
		try {
			await authApi.resetPassword(phone, code, data.newPassword);
			toast.success(t('auth.forgot_password.reset_success'));
			navigate('/login');
		} catch (error) {
			const message =
				axios.isAxiosError(error) && typeof error.response?.data?.message === 'string'
					? error.response.data.message
					: t('auth.forgot_password.reset_error');
			toast.error(message);
		} finally {
			setLoading(false);
		}
	};

	const stepDescriptions: Record<number, string> = {
		1: t('auth.forgot_password.step1_description'),
		2: t('auth.forgot_password.step2_description'),
		3: t('auth.forgot_password.step3_description'),
	};

	return (
		<Card {...props}>
			<CardHeader>
				<CardTitle>{t('auth.forgot_password.title')}</CardTitle>
				<CardDescription>{stepDescriptions[step]}</CardDescription>
			</CardHeader>
			<CardContent>
				{step === 1 && <PhoneStep onSubmit={handleSendCode} loading={loading} />}
				{step === 2 && <CodeStep onSubmit={handleVerifyCode} loading={loading} />}
				{step === 3 && <PasswordStep onSubmit={handleResetPassword} loading={loading} />}
			</CardContent>
		</Card>
	);
}
