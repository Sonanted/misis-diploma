import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Button } from '@/shared/ui/button';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/shared/ui/field';
import { PhoneInput } from '@/shared/ui/phone-input';

type PhoneFormValues = { phone: string };

export function PhoneStep({
	onSubmit,
	loading,
}: {
	onSubmit: (data: PhoneFormValues) => void;
	loading?: boolean;
}) {
	const { t } = useTranslation();
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<PhoneFormValues>({ mode: 'onBlur' });

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<FieldGroup>
				<Field data-invalid={!!errors.phone}>
					<FieldLabel>
						{t('auth.forgot_password.phone')} <span className="text-destructive">*</span>
					</FieldLabel>
					<Controller
						name="phone"
						control={control}
						rules={{ required: t('validation.required') }}
						render={({ field }) => (
							<PhoneInput
								value={field.value ?? ''}
								onChange={field.onChange}
								onBlur={field.onBlur}
								international
								defaultCountry="RU"
								placeholder={t('auth.forgot_password.phone_placeholder')}
							/>
						)}
					/>
					<FieldError errors={[errors.phone]} />
				</Field>
				<Field>
					<Button type="submit" disabled={loading}>
						{loading ? t('common.loading') : t('auth.forgot_password.send_code')}
					</Button>
					<FieldDescription className="px-6 text-center">
						{t('auth.forgot_password.remembered')}{' '}
						<Link to="/login">{t('auth.forgot_password.sign_in')}</Link>
					</FieldDescription>
				</Field>
			</FieldGroup>
		</form>
	);
}
