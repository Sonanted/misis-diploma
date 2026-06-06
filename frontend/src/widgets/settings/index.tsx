import { LogOut, Monitor, Moon, Save, Sun } from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { useLanguage } from '@/shared/ui/language-switcher-compact';
import { PhoneInput } from '@/shared/ui/phone-input';

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

export function Settings() {
	const { t } = useTranslation();
	const { theme, setTheme } = useTheme();
	const { lang, changeLanguage } = useLanguage();

	const THEME_OPTIONS: { value: Theme; label: string; icon: React.ElementType }[] = [
		{ value: 'light', label: t('settings.theme_light'), icon: Sun },
		{ value: 'dark', label: t('settings.theme_dark'), icon: Moon },
		{ value: 'system', label: t('settings.theme_system'), icon: Monitor },
	];

	const LANGUAGES = [
		{ code: 'en' as const, label: 'English' },
		{ code: 'ru' as const, label: 'Русский' },
	];

	const firstNameId = useId();
	const lastNameId = useId();
	const middleNameId = useId();
	const emailId = useId();
	const phoneId = useId();
	const pwdId = useId();

	const [personalInfo, setPersonalInfo] = useState({
		firstName: 'John',
		middleName: 'Alexander',
		lastName: 'Doe',
		email: 'john.doe@email.com',
		phone: '+79997732136',
	});

	const [passwordData, setPasswordData] = useState({
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
	});

	const handlePersonalInfoSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (
			!personalInfo.firstName ||
			!personalInfo.lastName ||
			!personalInfo.email ||
			!personalInfo.phone
		) {
			toast.error(t('settings.toast_fill_required'));
			return;
		}
		toast.success(t('settings.toast_personal_saved'));
	};

	const handlePasswordSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
			toast.error(t('settings.toast_password_fill'));
			return;
		}
		if (passwordData.newPassword !== passwordData.confirmPassword) {
			toast.error(t('settings.toast_password_mismatch'));
			return;
		}
		if (passwordData.newPassword.length < 8) {
			toast.error(t('settings.toast_password_short'));
			return;
		}
		toast.success(t('settings.toast_password_saved'));
		setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
	};

	return (
		<div className="flex flex-col h-full overflow-y-auto">
			<div className="p-8">
				<div className="max-w-2xl mx-auto space-y-6">
					<div>
						<h1 className="text-3xl font-semibold mb-2">{t('settings.title')}</h1>
						<p className="text-muted-foreground">{t('settings.description')}</p>
					</div>

					<Card>
						<CardHeader>
							<CardTitle>{t('settings.personal_info_title')}</CardTitle>
							<CardDescription>{t('settings.personal_info_description')}</CardDescription>
						</CardHeader>
						<CardContent>
							<form onSubmit={handlePersonalInfoSubmit} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor={firstNameId}>{t('settings.first_name')} *</Label>
									<Input
										id={firstNameId}
										value={personalInfo.firstName}
										onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor={lastNameId}>{t('settings.last_name')} *</Label>
									<Input
										id={lastNameId}
										value={personalInfo.lastName}
										onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor={middleNameId}>{t('settings.middle_name')}</Label>
									<Input
										id={middleNameId}
										value={personalInfo.middleName}
										onChange={(e) => setPersonalInfo({ ...personalInfo, middleName: e.target.value })}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor={emailId}>{t('settings.email')} *</Label>
									<Input
										id={emailId}
										type="email"
										value={personalInfo.email}
										onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor={phoneId}>{t('settings.phone')} *</Label>
									<PhoneInput
										id={phoneId}
										value={personalInfo.phone}
										onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target?.value ?? '' })}
										international
										placeholder={t('auth.login.phone_placeholder')}
										required
									/>
								</div>

								<div className="pt-4">
									<Button type="submit" className="w-full">
										<Save className="size-4 mr-2" />
										{t('settings.save')}
									</Button>
								</div>
							</form>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>{t('settings.password_title')}</CardTitle>
							<CardDescription>{t('settings.password_description')}</CardDescription>
						</CardHeader>
						<CardContent>
							<form onSubmit={handlePasswordSubmit} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor={`${pwdId}-current`}>{t('settings.current_password')} *</Label>
									<Input
										id={`${pwdId}-current`}
										type="password"
										value={passwordData.currentPassword}
										onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor={`${pwdId}-new`}>{t('settings.new_password')} *</Label>
									<Input
										id={`${pwdId}-new`}
										type="password"
										value={passwordData.newPassword}
										onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
									/>
									<p className="text-xs text-muted-foreground">{t('settings.password_hint')}</p>
								</div>

								<div className="space-y-2">
									<Label htmlFor={`${pwdId}-confirm`}>{t('settings.confirm_password')} *</Label>
									<Input
										id={`${pwdId}-confirm`}
										type="password"
										value={passwordData.confirmPassword}
										onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
									/>
								</div>

								<div className="pt-4">
									<Button type="submit" className="w-full">
										<Save className="size-4 mr-2" />
										{t('settings.update_password')}
									</Button>
								</div>
							</form>
						</CardContent>
					</Card>

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

					<Button type="button" variant="destructive" className="w-full">
						<LogOut className="size-4 mr-2" />
						{t('settings.logout')}
					</Button>
				</div>
			</div>
		</div>
	);
}
