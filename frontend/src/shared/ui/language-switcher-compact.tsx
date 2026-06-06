import { Button } from '../ui/button';
import { cn } from '@/shared/lib/utils';
import { useState } from 'react';

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'RU' },
] as const;

type LangCode = (typeof LANGUAGES)[number]['code'];

export function useLanguage() {
  const [lang, setLang] = useState<LangCode>(() => {
    return (localStorage.getItem('i18n_language') as LangCode) ?? 'en';
  });

  const changeLanguage = (code: LangCode) => {
    setLang(code);
    localStorage.setItem('i18n_language', code);
    // i18n.changeLanguage(code) if using i18next
  };

  return { lang, changeLanguage };
}

export function LanguageSwitcherCompact({ lang, onChange }: { lang: LangCode; onChange: (c: LangCode) => void }) {
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
