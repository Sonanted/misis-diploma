import { Outlet } from 'react-router';
import { LanguageSwitcherCompact, useLanguage } from '../ui/language-switcher-compact';
import { ThemeSwitcherCompact, useTheme } from '../ui/theme-switcher-compact';

export default function PublicLayout() {
	const { theme, setTheme } = useTheme();
	const { lang, changeLanguage } = useLanguage();
	return (
		<div className="relative flex min-h-svh w-full items-center justify-center p-6 md:p-10">
			{/* Switchers at top right */}
			<div className="absolute right-4 top-4 flex flex-col gap-2">
				<ThemeSwitcherCompact theme={theme} onChange={setTheme} />
				<LanguageSwitcherCompact lang={lang} onChange={changeLanguage} />
			</div>
			<div className="w-full max-w-sm">
				<Outlet />
			</div>
		</div>
	);
}
