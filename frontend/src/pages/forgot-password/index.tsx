import type { ComponentProps } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { CodeStep } from '@/features/auth/forgot-password/CodeStep';
import { PasswordStep } from '@/features/auth/forgot-password/PasswordStep';
import { PhoneStep } from '@/features/auth/forgot-password/PhoneStep';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';

export default function ForgotPassword({ ...props }: ComponentProps<typeof Card>) {
	const { t } = useTranslation();
	const [step, setStep] = useState(1);

	const handleSendCode = (data: { phone: string }) => {
		// biome-ignore lint/suspicious/noConsole: temporary
		console.log('forgot-password step 1', data);
		const confirmCode = Math.floor(100000 + Math.random() * 900000).toString();
		toast.success(`${data.phone} — confirmation code: ${confirmCode}`);
		setStep(2);
	};

	const handleVerifyCode = (data: { code: string }) => {
		// biome-ignore lint/suspicious/noConsole: temporary
		console.log('forgot-password step 2', data);
		setStep(3);
	};

	const handleResetPassword = (data: { newPassword: string }) => {
		// biome-ignore lint/suspicious/noConsole: temporary
		console.log('forgot-password step 3', data);
		alert('Password reset!');
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
				{step === 1 && <PhoneStep onSubmit={handleSendCode} />}
				{step === 2 && <CodeStep onSubmit={handleVerifyCode} />}
				{step === 3 && <PasswordStep onSubmit={handleResetPassword} />}
			</CardContent>
		</Card>
	);
}
