import type { ComponentProps } from 'react';
import { type SubmitEvent, useState } from 'react';
import { toast } from 'sonner';
import { CodeStep } from '@/features/auth/forgot-password/CodeStep';
import { PasswordStep } from '@/features/auth/forgot-password/PasswordStep';
import { PhoneStep } from '@/features/auth/forgot-password/PhoneStep';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';

export default function ForgotPassword({ ...props }: ComponentProps<typeof Card>) {
	const [step, setStep] = useState(1);
	const [phone, setPhone] = useState('');
	const [code, setCode] = useState('');
	const [newPassword, setNewPassword] = useState('');

	// Step 1: send code
	const handleSendCode = (e: SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		// Simulate sending code
		const confirmCode = Math.floor(100000 + Math.random() * 900000).toString();
		toast.success(`Confirmation code: ${confirmCode}`);
		setStep(2);
	};

	// Step 2: verify code
	const handleVerifyCode = (e: SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		// TODO: verify code
		setStep(3);
	};

	// Step 3: reset password
	const handleResetPassword = (e: SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		// TODO: reset password
		alert('Password reset!');
	};

	return (
		<Card {...props}>
			<CardHeader>
				<CardTitle>Forgot Password</CardTitle>
				<CardDescription>
					{step === 1 && 'Enter your phone number to receive a reset code.'}
					{step === 2 && 'Enter the code sent to your phone.'}
					{step === 3 && 'Set a new password for your account.'}
				</CardDescription>
			</CardHeader>
			<CardContent>
				{step === 1 && <PhoneStep phone={phone} setPhone={setPhone} onSubmit={handleSendCode} />}
				{step === 2 && <CodeStep code={code} setCode={setCode} onSubmit={handleVerifyCode} />}
				{step === 3 && (
					<PasswordStep
						newPassword={newPassword}
						setNewPassword={setNewPassword}
						onSubmit={handleResetPassword}
					/>
				)}
			</CardContent>
		</Card>
	);
}
