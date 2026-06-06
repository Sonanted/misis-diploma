import { type ComponentProps, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { PhoneInput } from '@/shared/ui/phone-input';

export default function Signup({ ...props }: ComponentProps<typeof Card>) {
	const { t } = useTranslation();
	const [phoneNumber, setPhoneNumber] = useState('');

	const firstNameInputId = useId();
	const lastNameInputId = useId();
	const phoneInputId = useId();
	const emailInputId = useId();
	const passwordInputId = useId();
	const confirmPasswordInputId = useId();

	return (
		<Card {...props}>
			<CardHeader>
				<CardTitle>{t('auth.signup.title')}</CardTitle>
				<CardDescription>{t('auth.signup.description')}</CardDescription>
			</CardHeader>
			<CardContent>
				<form>
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor={firstNameInputId}>
								{t('auth.signup.first_name')} <span className="text-destructive">*</span>
							</FieldLabel>
							<Input id={firstNameInputId} type="text" placeholder="John" required />
						</Field>

						<Field>
							<FieldLabel htmlFor={lastNameInputId}>
								{t('auth.signup.last_name')} <span className="text-destructive">*</span>
							</FieldLabel>
							<Input id={lastNameInputId} type="text" placeholder="Doe" required />
						</Field>

						<Field>
							<FieldLabel htmlFor={phoneInputId}>
								{t('auth.signup.phone')} <span className="text-destructive">*</span>
							</FieldLabel>
							<PhoneInput
								id={phoneInputId}
								value={phoneNumber}
								onChange={setPhoneNumber}
								international
								defaultCountry="RU"
								placeholder={t('auth.login.phone_placeholder')}
								required
							/>
						</Field>

						<Field>
							<FieldLabel htmlFor={emailInputId}>{t('auth.signup.email')}</FieldLabel>
							<Input id={emailInputId} type="email" placeholder={t('auth.signup.email_placeholder')} />
						</Field>

						<Field>
							<FieldLabel htmlFor={passwordInputId}>
								{t('auth.signup.password')} <span className="text-destructive">*</span>
							</FieldLabel>
							<Input id={passwordInputId} type="password" required />
							<FieldDescription>{t('auth.signup.password_hint')}</FieldDescription>
						</Field>

						<Field>
							<FieldLabel htmlFor={confirmPasswordInputId}>
								{t('auth.signup.confirm_password')} <span className="text-destructive">*</span>
							</FieldLabel>
							<Input id={confirmPasswordInputId} type="password" required />
							<FieldDescription>{t('auth.signup.confirm_password_hint')}</FieldDescription>
						</Field>

						<Field>
							<Button type="submit">{t('auth.signup.submit')}</Button>

							<FieldDescription className="px-6 text-center">
								{t('auth.signup.have_account')} <Link to="/login">{t('auth.signup.sign_in')}</Link>
							</FieldDescription>
						</Field>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	);
}
