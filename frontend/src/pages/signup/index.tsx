import type { ComponentProps } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { PhoneInput } from '@/shared/ui/phone-input';

type SignupFormValues = {
	firstName: string;
	lastName: string;
	phone: string;
	email: string;
	password: string;
	confirmPassword: string;
};

export default function Signup({ ...props }: ComponentProps<typeof Card>) {
	const { t } = useTranslation();
	const {
		register,
		control,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<SignupFormValues>({ mode: 'onBlur' });

	const onSubmit = (data: SignupFormValues) => {
		// biome-ignore lint/suspicious/noConsole: temporary
		console.log('signup', data);
	};

	return (
		<Card {...props}>
			<CardHeader>
				<CardTitle>{t('auth.signup.title')}</CardTitle>
				<CardDescription>{t('auth.signup.description')}</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit(onSubmit)}>
					<FieldGroup>
						<Field data-invalid={!!errors.firstName}>
							<FieldLabel>
								{t('auth.signup.first_name')} <span className="text-destructive">*</span>
							</FieldLabel>
							<Input
								type="text"
								placeholder="John"
								{...register('firstName', { required: t('validation.required') })}
							/>
							<FieldError errors={[errors.firstName]} />
						</Field>

						<Field data-invalid={!!errors.lastName}>
							<FieldLabel>
								{t('auth.signup.last_name')} <span className="text-destructive">*</span>
							</FieldLabel>
							<Input
								type="text"
								placeholder="Doe"
								{...register('lastName', { required: t('validation.required') })}
							/>
							<FieldError errors={[errors.lastName]} />
						</Field>

						<Field data-invalid={!!errors.phone}>
							<FieldLabel>
								{t('auth.signup.phone')} <span className="text-destructive">*</span>
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
										placeholder={t('auth.login.phone_placeholder')}
									/>
								)}
							/>
							<FieldError errors={[errors.phone]} />
						</Field>

						<Field data-invalid={!!errors.email}>
							<FieldLabel>{t('auth.signup.email')}</FieldLabel>
							<Input
								type="email"
								placeholder={t('auth.signup.email_placeholder')}
								{...register('email', {
									pattern: {
										value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
										message: t('validation.email_invalid'),
									},
								})}
							/>
							<FieldError errors={[errors.email]} />
						</Field>

						<Field data-invalid={!!errors.password}>
							<FieldLabel>
								{t('auth.signup.password')} <span className="text-destructive">*</span>
							</FieldLabel>
							<Input
								type="password"
								{...register('password', {
									required: t('validation.required'),
									minLength: { value: 8, message: t('validation.password_min') },
								})}
							/>
							<FieldDescription>{t('auth.signup.password_hint')}</FieldDescription>
							<FieldError errors={[errors.password]} />
						</Field>

						<Field data-invalid={!!errors.confirmPassword}>
							<FieldLabel>
								{t('auth.signup.confirm_password')} <span className="text-destructive">*</span>
							</FieldLabel>
							<Input
								type="password"
								{...register('confirmPassword', {
									required: t('validation.required'),
									validate: (v) => v === watch('password') || t('validation.password_mismatch'),
								})}
							/>
							<FieldDescription>{t('auth.signup.confirm_password_hint')}</FieldDescription>
							<FieldError errors={[errors.confirmPassword]} />
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
