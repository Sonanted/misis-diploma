import { type SubmitEvent, useId } from 'react';
import { useTranslation } from 'react-i18next';
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
	const { t } = useTranslation();
	const passwordInputId = useId();
	return (
		<form onSubmit={onSubmit}>
			<FieldGroup>
				<Field>
					<FieldLabel htmlFor={passwordInputId}>
						{t('auth.forgot_password.new_password')} <span className="text-destructive">*</span>
					</FieldLabel>
					<Input
						id={passwordInputId}
						type="password"
						placeholder={t('auth.forgot_password.new_password_placeholder')}
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}
						required
					/>
					<FieldDescription>{t('auth.forgot_password.password_hint')}</FieldDescription>
				</Field>
				<Field>
					<Button type="submit">{t('auth.forgot_password.reset_password')}</Button>
					<FieldDescription className="px-6 text-center">
						{t('auth.forgot_password.remembered')} <Link to="/login">{t('auth.forgot_password.sign_in')}</Link>
					</FieldDescription>
				</Field>
			</FieldGroup>
		</form>
	);
}
