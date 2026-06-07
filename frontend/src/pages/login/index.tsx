import type { ComponentProps } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { useAuthStore } from '@/entities/user/model';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { PhoneInput } from '@/shared/ui/phone-input';

type LoginFormValues = {
	phone: string;
	password: string;
};

export default function Login({ ...props }: ComponentProps<'div'>) {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const login = useAuthStore((state) => state.login);
	const {
		register,
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormValues>({ mode: 'onBlur' });

	const onSubmit = (_data: LoginFormValues) => {
		login();
		navigate('/');
	};

	return (
		<Card {...props}>
			<CardHeader>
				<CardTitle>{t('auth.login.title')}</CardTitle>
				<CardDescription>{t('auth.login.description')}</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit(onSubmit)}>
					<FieldGroup>
						<Field data-invalid={!!errors.phone}>
							<FieldLabel>{t('auth.login.phone')}</FieldLabel>
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

						<Field data-invalid={!!errors.password}>
							<FieldLabel>{t('auth.login.password')}</FieldLabel>
							<Input
								type="password"
								{...register('password', { required: t('validation.required') })}
							/>
							<FieldError errors={[errors.password]} />
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
