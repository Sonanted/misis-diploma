import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Button } from '@/shared/ui/button';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';

type CodeFormValues = { code: string };

export function CodeStep({ onSubmit }: { onSubmit: (data: CodeFormValues) => void }) {
	const { t } = useTranslation();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CodeFormValues>({ mode: 'onBlur' });

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<FieldGroup>
				<Field data-invalid={!!errors.code}>
					<FieldLabel>
						{t('auth.forgot_password.code')} <span className="text-destructive">*</span>
					</FieldLabel>
					<Input
						type="text"
						placeholder={t('auth.forgot_password.code_placeholder')}
						{...register('code', { required: t('validation.required') })}
					/>
					<FieldError errors={[errors.code]} />
				</Field>
				<Field>
					<Button type="submit">{t('auth.forgot_password.verify_code')}</Button>
					<FieldDescription className="px-6 text-center">
						{t('auth.forgot_password.remembered')} <Link to="/login">{t('auth.forgot_password.sign_in')}</Link>
					</FieldDescription>
				</Field>
			</FieldGroup>
		</form>
	);
}
