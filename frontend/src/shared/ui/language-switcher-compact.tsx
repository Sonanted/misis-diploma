import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import { cn } from '@/shared/lib/utils';

const LANGUAGES = [
	{ code: 'en', label: 'EN' },
	{ code: 'ru', label: 'RU' },
] as const;

type LangCode = (typeof LANGUAGES)[number]['code'];

export function useLanguage() {
	const { i18n } = useTranslation();
	const lang = (i18n.language ?? 'en') as LangCode;

	const changeLanguage = (code: LangCode) => {
		i18n.changeLanguage(code);
		localStorage.setItem('i18n_language', code);
	};

	return { lang, changeLanguage };
}

export function LanguageSwitcherCompact({
	lang,
	onChange,
}: {
	lang: LangCode;
	onChange: (c: LangCode) => void;
}) {
	return (
		<div className="flex gap-1 justify-end w-full">
			{LANGUAGES.map(({ code, label }) => (
				<Button
					key={code}
					type="button"
					size="xs"
					variant={lang === code ? 'default' : 'outline'}
					onClick={() => onChange(code)}
					aria-label={label}
					className={cn('px-1.5 py-1 h-7 w-7 flex items-center justify-center', lang === code ? '' : 'bg-transparent')}
				>
					{label}
				</Button>
			))}
		</div>
	);
}
