import { type ComponentProps, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { PhoneInput } from '@/shared/ui/phone-input';

export default function Login({ ...props }: ComponentProps<'div'>) {
	const { t } = useTranslation();
	const [phoneNumber, setPhoneNumber] = useState('');

	const phoneInputId = useId();
	const passwordInputId = useId();

	return (
		<Card {...props}>
			<CardHeader>
				<CardTitle>{t('auth.login.title')}</CardTitle>
				<CardDescription>{t('auth.login.description')}</CardDescription>
			</CardHeader>
			<CardContent>
				<form>
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor={phoneInputId}>{t('auth.login.phone')}</FieldLabel>
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
							<div className="flex items-center">
								<FieldLabel htmlFor={passwordInputId} className="gap-1">
									{t('auth.login.password')}
								</FieldLabel>
							</div>
							<Input id={passwordInputId} type="password" required />
						</Field>
						<Field>
							<Button type="submit">{t('auth.login.submit')}</Button>

							<FieldDescription className="text-center">
								<Link to="/forgot-password">{t('auth.login.forgot_password')}</Link>
							</FieldDescription>
							<FieldDescription className="text-center">
								{t('auth.login.no_account')} <Link to="/signup">{t('auth.login.sign_up')}</Link>
							</FieldDescription>
						</Field>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	);
}
