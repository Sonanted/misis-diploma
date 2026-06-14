import axios from 'axios';
import { LogOut, Monitor, Moon, Save, Sun } from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useAuthStore } from '@/entities/user/model';
import { useChangePassword, useMe, useUpdateMe } from '@/entities/user/queries';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { useLanguage } from '@/shared/ui/language-switcher-compact';
import { PhoneInput } from '@/shared/ui/phone-input';
import { Skeleton } from '@/shared/ui/skeleton';

type Theme = 'light' | 'dark' | 'system';

function applyTheme(theme: Theme) {
	const root = document.documentElement;
	if (theme === 'system') {
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		root.classList.toggle('dark', prefersDark);
	} else {
		root.classList.toggle('dark', theme === 'dark');
	}
}

function useTheme() {
	const [theme, setTheme] = useState<Theme>(() => {
		return (localStorage.getItem('theme') as Theme) ?? 'system';
	});

	useEffect(() => {
		applyTheme(theme);
		localStorage.setItem('theme', theme);
	}, [theme]);

	useEffect(() => {
		const mq = window.matchMedia('(prefers-color-scheme: dark)');
		const handler = () => {
			if (theme === 'system') applyTheme('system');
		};
		mq.addEventListener('change', handler);
		return () => mq.removeEventListener('change', handler);
	}, [theme]);

	return { theme, setTheme };
}

type PersonalInfoValues = {
	firstName: string;
	lastName: string;
	middleName: string;
	email: string;
	phone: string;
};

type PasswordValues = {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
};

export function Settings() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const logout = useAuthStore((state) => state.logout);
	const { theme, setTheme } = useTheme();
	const { lang, changeLanguage } = useLanguage();

	const { data: me, isLoading: meLoading } = useMe();
	const updateMe = useUpdateMe();
	const changePassword = useChangePassword();

	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	const THEME_OPTIONS: { value: Theme; label: string; icon: React.ElementType }[] = [
		{ value: 'light', label: t('settings.theme_light'), icon: Sun },
		{ value: 'dark', label: t('settings.theme_dark'), icon: Moon },
		{ value: 'system', label: t('settings.theme_system'), icon: Monitor },
	];

	const LANGUAGES = [
		{ code: 'en' as const, label: 'English' },
		{ code: 'ru' as const, label: 'Русский' },
	];

	const pwdId = useId();

	const personalForm = useForm<PersonalInfoValues>({ mode: 'onBlur' });
	const passwordForm = useForm<PasswordValues>({ mode: 'onBlur' });

	useEffect(() => {
		if (me) {
			personalForm.reset({
				firstName: me.firstName,
				lastName: me.lastName,
				middleName: me.middleName ?? '',
				email: me.email,
				phone: me.phone,
			});
		}
	}, [me, personalForm.reset]);

	const handlePersonalInfoError = (error: unknown) => {
		if (!axios.isAxiosError(error)) {
			toast.error(t('settings.toast_error'));
			return;
		}
		const body = error.response?.data as
			| { message?: { errors?: Record<string, string> } | string }
			| undefined;
		const fieldErrors =
			body && typeof body.message === 'object' ? body.message?.errors : undefined;
		if (fieldErrors?.email) personalForm.setError('email', { message: fieldErrors.email });
		if (fieldErrors?.phone) personalForm.setError('phone', { message: fieldErrors.phone });
		if (!fieldErrors) toast.error(t('settings.toast_error'));
	};

	const handlePersonalInfoSubmit = (data: PersonalInfoValues) => {
		updateMe.mutate(data, {
			onSuccess: () => toast.success(t('settings.toast_personal_saved')),
			onError: handlePersonalInfoError,
		});
	};

	const handlePasswordSubmit = (data: PasswordValues) => {
		if (data.newPassword !== data.confirmPassword) {
			passwordForm.setError('confirmPassword', { message: t('validation.password_mismatch') });
			return;
		}
		changePassword.mutate(
			{ currentPassword: data.currentPassword, newPassword: data.newPassword },
			{
				onSuccess: () => {
					toast.success(t('settings.toast_password_saved'));
					passwordForm.reset();
				},
				onError: (error) => {
					const message = axios.isAxiosError(error)
						? (error.response?.data?.message as string | undefined) ?? t('settings.toast_error')
						: t('settings.toast_error');
					if (error instanceof Error && axios.isAxiosError(error) && error.response?.status === 401) {
						passwordForm.setError('currentPassword', { message });
					} else {
						toast.error(message);
					}
				},
			},
		);
	};

	return (
		<div className="flex flex-col h-full overflow-y-auto">
			<div className="p-8">
				<div className="max-w-2xl mx-auto space-y-6">
					<div>
						<h1 className="text-3xl font-semibold mb-2">{t('settings.title')}</h1>
						<p className="text-muted-foreground">{t('settings.description')}</p>
					</div>

					{/* Personal info */}
					<Card>
						<CardHeader>
							<CardTitle>{t('settings.personal_info_title')}</CardTitle>
							<CardDescription>{t('settings.personal_info_description')}</CardDescription>
						</CardHeader>
						<CardContent>
							{meLoading ? (
								<div className="space-y-4">
									{Array.from({ length: 5 }).map((_, i) => (
										// biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
										<Skeleton key={i} className="h-9 rounded-md" />
									))}
								</div>
							) : (
								<form onSubmit={personalForm.handleSubmit(handlePersonalInfoSubmit)} className="space-y-4">
									<FieldGroup>
										<Field data-invalid={!!personalForm.formState.errors.firstName}>
											<FieldLabel>{t('settings.first_name')} *</FieldLabel>
											<Input {...personalForm.register('firstName', { required: t('validation.required') })} />
											<FieldError errors={[personalForm.formState.errors.firstName]} />
										</Field>

										<Field data-invalid={!!personalForm.formState.errors.lastName}>
											<FieldLabel>{t('settings.last_name')} *</FieldLabel>
											<Input {...personalForm.register('lastName', { required: t('validation.required') })} />
											<FieldError errors={[personalForm.formState.errors.lastName]} />
										</Field>

										<Field>
											<FieldLabel>{t('settings.middle_name')}</FieldLabel>
											<Input {...personalForm.register('middleName')} />
										</Field>

										<Field data-invalid={!!personalForm.formState.errors.email}>
											<FieldLabel>{t('settings.email')} *</FieldLabel>
											<Input
												type="email"
												{...personalForm.register('email', {
													required: t('validation.required'),
													pattern: {
														value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
														message: t('validation.email_invalid'),
													},
												})}
											/>
											<FieldError errors={[personalForm.formState.errors.email]} />
										</Field>

										<Field data-invalid={!!personalForm.formState.errors.phone}>
											<FieldLabel>{t('settings.phone')} *</FieldLabel>
											<Controller
												name="phone"
												control={personalForm.control}
												rules={{ required: t('validation.required') }}
												render={({ field }) => (
													<PhoneInput
														id={`${pwdId}-phone`}
														value={field.value ?? ''}
														onChange={field.onChange}
														onBlur={field.onBlur}
														international
														placeholder={t('auth.login.phone_placeholder')}
													/>
												)}
											/>
											<FieldError errors={[personalForm.formState.errors.phone]} />
										</Field>
									</FieldGroup>

									<div className="pt-4">
										<Button type="submit" className="w-full" disabled={updateMe.isPending}>
											<Save className="size-4 mr-2" />
											{t('settings.save')}
										</Button>
									</div>
								</form>
							)}
						</CardContent>
					</Card>

					{/* Change password */}
					<Card>
						<CardHeader>
							<CardTitle>{t('settings.password_title')}</CardTitle>
							<CardDescription>{t('settings.password_description')}</CardDescription>
						</CardHeader>
						<CardContent>
							<form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
								<FieldGroup>
									<Field data-invalid={!!passwordForm.formState.errors.currentPassword}>
										<FieldLabel>{t('settings.current_password')} *</FieldLabel>
										<Input
											id={`${pwdId}-current`}
											type="password"
											{...passwordForm.register('currentPassword', { required: t('validation.required') })}
										/>
										<FieldError errors={[passwordForm.formState.errors.currentPassword]} />
									</Field>

									<Field data-invalid={!!passwordForm.formState.errors.newPassword}>
										<FieldLabel>{t('settings.new_password')} *</FieldLabel>
										<Input
											id={`${pwdId}-new`}
											type="password"
											{...passwordForm.register('newPassword', {
												required: t('validation.required'),
												minLength: { value: 8, message: t('validation.password_min') },
												validate: (v) =>
													v !== passwordForm.watch('currentPassword') ||
													t('validation.password_same_as_current'),
											})}
										/>
										<p className="text-xs text-muted-foreground">{t('settings.password_hint')}</p>
										<FieldError errors={[passwordForm.formState.errors.newPassword]} />
									</Field>

									<Field data-invalid={!!passwordForm.formState.errors.confirmPassword}>
										<FieldLabel>{t('settings.confirm_password')} *</FieldLabel>
										<Input
											id={`${pwdId}-confirm`}
											type="password"
											{...passwordForm.register('confirmPassword', {
												required: t('validation.required'),
												validate: (v) =>
													v === passwordForm.watch('newPassword') || t('validation.password_mismatch'),
											})}
										/>
										<FieldError errors={[passwordForm.formState.errors.confirmPassword]} />
									</Field>
								</FieldGroup>

								<div className="pt-4">
									<Button type="submit" className="w-full" disabled={changePassword.isPending}>
										<Save className="size-4 mr-2" />
										{t('settings.update_password')}
									</Button>
								</div>
							</form>
						</CardContent>
					</Card>

					{/* Appearance */}
					<Card>
						<CardHeader>
							<CardTitle>{t('settings.appearance_title')}</CardTitle>
							<CardDescription>{t('settings.appearance_description')}</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="space-y-2">
								<Label>{t('settings.theme')}</Label>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-2">
									{THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
										<Button
											key={value}
											type="button"
											size="sm"
											variant={theme === value ? 'default' : 'outline'}
											onClick={() => setTheme(value)}
										>
											<Icon className="size-3.5" />
											{label}
										</Button>
									))}
								</div>
							</div>

							<div className="space-y-2">
								<Label>{t('settings.language')}</Label>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
									{LANGUAGES.map(({ code, label }) => (
										<Button
											key={code}
											type="button"
											size="sm"
											variant={lang === code ? 'default' : 'outline'}
											onClick={() => changeLanguage(code)}
										>
											{label}
										</Button>
									))}
								</div>
							</div>
						</CardContent>
					</Card>

					<Button type="button" variant="destructive" className="w-full" onClick={handleLogout}>
						<LogOut className="size-4 mr-2" />
						{t('settings.logout')}
					</Button>
				</div>
			</div>
		</div>
	);
}
