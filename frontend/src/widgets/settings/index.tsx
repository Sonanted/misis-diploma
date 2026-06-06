import { LogOut, Monitor, Moon, Save, Sun } from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
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

const LANGUAGES = [
	{ code: 'en', label: 'English' },
	{ code: 'ru', label: 'Русский' },
] as const;

type LangCode = (typeof LANGUAGES)[number]['code'];

function useLanguage() {
	const [lang, setLang] = useState<LangCode>(() => {
		return (localStorage.getItem('i18n_language') as LangCode) ?? 'en';
	});

	const changeLanguage = (code: LangCode) => {
		setLang(code);
		localStorage.setItem('i18n_language', code);
	};

	return { lang, changeLanguage };
}

const THEME_OPTIONS: { value: Theme; label: string; icon: React.ElementType }[] = [
	{ value: 'light', label: 'Light', icon: Sun },
	{ value: 'dark', label: 'Dark', icon: Moon },
	{ value: 'system', label: 'System', icon: Monitor },
];

function ThemeSwitcher({ theme, onChange }: { theme: Theme; onChange: (t: Theme) => void }) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-2">
			{THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
				<Button
					key={value}
					type="button"
					size="sm"
					variant={theme === value ? 'default' : 'outline'}
					onClick={() => onChange(value)}
				>
					<Icon className="size-3.5" />
					{label}
				</Button>
			))}
		</div>
	);
}

function LanguageSelector({ lang, onChange }: { lang: LangCode; onChange: (c: LangCode) => void }) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
			{LANGUAGES.map(({ code, label }) => (
				<Button
					key={code}
					type="button"
					size="sm"
					variant={lang === code ? 'default' : 'outline'}
					onClick={() => onChange(code)}
				>
					{label}
				</Button>
			))}
		</div>
	);
}

export function Settings() {
	const { theme, setTheme } = useTheme();
	const { lang, changeLanguage } = useLanguage();

	const [personalInfo, setPersonalInfo] = useState({
		firstName: 'John',
		middleName: 'Alexander',
		lastName: 'Doe',
		email: 'john.doe@email.com',
		phone: '+79997732136',
	});

	const pwdId = useId();
	const [passwordOpen, setPasswordOpen] = useState(false);
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
			toast.error('Please fill in all required fields');
			return;
		}
		toast.success('Personal information updated successfully!');
	};

	const handlePasswordSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
			toast.error('Please fill in all password fields');
			return;
		}
		if (passwordData.newPassword !== passwordData.confirmPassword) {
			toast.error('New passwords do not match');
			return;
		}
		if (passwordData.newPassword.length < 8) {
			toast.error('Password must be at least 8 characters long');
			return;
		}
		toast.success('Password updated successfully!');
		setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
		setPasswordOpen(false);
	};

	return (
		<div className="flex flex-col h-full overflow-y-auto">
			<div className="p-8">
				<div className="max-w-2xl mx-auto space-y-6">
					<div>
						<h1 className="text-3xl font-semibold mb-2">Settings</h1>
						<p className="text-muted-foreground">Manage your account settings and preferences</p>
					</div>

					<Card>
						<CardHeader>
							<CardTitle>Personal Information</CardTitle>
							<CardDescription>Update your personal details</CardDescription>
						</CardHeader>
						<CardContent>
							<form onSubmit={handlePersonalInfoSubmit} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="firstName">First Name *</Label>
									<Input
										id="firstName"
										value={personalInfo.firstName}
										onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="lastName">Last Name *</Label>
									<Input
										id="lastName"
										value={personalInfo.lastName}
										onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="middleName">Middle Name</Label>
									<Input
										id="middleName"
										value={personalInfo.middleName}
										onChange={(e) => setPersonalInfo({ ...personalInfo, middleName: e.target.value })}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="email">Email *</Label>
									<Input
										id="email"
										type="email"
										value={personalInfo.email}
										onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="phone">Phone Number *</Label>
									<PhoneInput
										id="phone"
										value={personalInfo.phone}
										onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target?.value ?? '' })}
										international
										placeholder="Enter a phone number"
										required
									/>
								</div>

								<div className="pt-4">
									<Button type="submit" className="w-full">
										<Save className="size-4 mr-2" />
										Save Changes
									</Button>
								</div>
							</form>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Change Password</CardTitle>
							<CardDescription>Update your password to keep your account secure</CardDescription>
						</CardHeader>
						<CardContent>
							<form onSubmit={handlePasswordSubmit} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="currentPassword">Current Password *</Label>
									<Input
										id="currentPassword"
										type="password"
										value={passwordData.currentPassword}
										onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="newPassword">New Password *</Label>
									<Input
										id="newPassword"
										type="password"
										value={passwordData.newPassword}
										onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
									/>
									<p className="text-xs text-muted-foreground">
										Password must be at least 8 characters long
									</p>
								</div>

								<div className="space-y-2">
									<Label htmlFor="confirmPassword">Confirm New Password *</Label>
									<Input
										id="confirmPassword"
										type="password"
										value={passwordData.confirmPassword}
										onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
									/>
								</div>

								<div className="pt-4">
									<Button type="submit" className="w-full">
										<Save className="size-4 mr-2" />
										Update Password
									</Button>
								</div>
							</form>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Appearance</CardTitle>
							<CardDescription>Customize how the app looks and feels</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="space-y-2">
								<Label>Theme</Label>
								<ThemeSwitcher theme={theme} onChange={setTheme} />
							</div>

							<div className="space-y-2">
								<Label>Language</Label>
								<LanguageSelector lang={lang} onChange={changeLanguage} />
							</div>
						</CardContent>
					</Card>

					<Button type="button" variant="destructive" className="w-full">
						<LogOut className="size-4 mr-2" />
						Log Out
					</Button>
				</div>
			</div>
		</div>
	);
}
