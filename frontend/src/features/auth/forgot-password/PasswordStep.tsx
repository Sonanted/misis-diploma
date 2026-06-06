import { type SubmitEvent, useId } from 'react';
import { Link } from 'react-router';
import { Button } from '@/shared/ui/button';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';

export function PasswordStep({
	newPassword,
	setNewPassword,
	onSubmit,
}: {
	newPassword: string;
	setNewPassword: (v: string) => void;
	onSubmit: (e: SubmitEvent<HTMLFormElement>) => void;
}) {
	const passwordInputId = useId();
	return (
		<form onSubmit={onSubmit}>
			<FieldGroup>
				<Field>
					<FieldLabel htmlFor={passwordInputId}>
						New Password <span className="text-destructive">*</span>
					</FieldLabel>
					<Input
						id={passwordInputId}
						type="password"
						placeholder="Enter new password"
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}
						required
					/>
					<FieldDescription>Must be at least 8 characters long.</FieldDescription>
				</Field>
				<Field>
					<Button type="submit">Reset Password</Button>
					<FieldDescription className="px-6 text-center">
						Remembered your password? <Link to="/login">Sign in</Link>
					</FieldDescription>
				</Field>
			</FieldGroup>
		</form>
	);
}
