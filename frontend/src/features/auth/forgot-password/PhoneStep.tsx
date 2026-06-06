import { type SubmitEvent, useId } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Button } from '@/shared/ui/button';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/shared/ui/field';
import { PhoneInput } from '@/shared/ui/phone-input';

export function PhoneStep({
	phone,
	setPhone,
	onSubmit,
}: {
	phone: string;
	setPhone: (v: string) => void;
	onSubmit: (e: SubmitEvent<HTMLFormElement>) => void;
}) {
	const { t } = useTranslation();
	const phoneInputId = useId();
	return (
		<form onSubmit={onSubmit}>
			<FieldGroup>
				<Field>
					<FieldLabel htmlFor={phoneInputId}>
						{t('auth.forgot_password.phone')} <span className="text-destructive">*</span>
					</FieldLabel>
					<PhoneInput
						id={phoneInputId}
						value={phone}
						onChange={setPhone}
						international
						defaultCountry="RU"
						placeholder={t('auth.forgot_password.phone_placeholder')}
						required
					/>
				</Field>
				<Field>
					<Button type="submit">{t('auth.forgot_password.send_code')}</Button>
					<FieldDescription className="px-6 text-center">
						{t('auth.forgot_password.remembered')} <Link to="/login">{t('auth.forgot_password.sign_in')}</Link>
					</FieldDescription>
				</Field>
			</FieldGroup>
		</form>
	);
}
