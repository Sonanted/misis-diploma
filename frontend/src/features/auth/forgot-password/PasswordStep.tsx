import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Button } from '@/shared/ui/button';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';

type PasswordFormValues = { newPassword: string };

export function PasswordStep({ onSubmit }: { onSubmit: (data: PasswordFormValues) => void }) {
	const { t } = useTranslation();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<PasswordFormValues>({ mode: 'onBlur' });

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<FieldGroup>
				<Field data-invalid={!!errors.newPassword}>
					<FieldLabel>
						{t('auth.forgot_password.new_password')} <span className="text-destructive">*</span>
					</FieldLabel>
					<Input
						type="password"
						placeholder={t('auth.forgot_password.new_password_placeholder')}
						{...register('newPassword', {
							required: t('validation.required'),
							minLength: { value: 8, message: t('validation.password_min') },
						})}
					/>
					<FieldDescription>{t('auth.forgot_password.password_hint')}</FieldDescription>
					<FieldError errors={[errors.newPassword]} />
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
